const path = require("path");
const fs = require("fs");
const git = require("../lib/git.cjs");

// Build a single-string shell command safely (quotes args)
function shellJoin(cmd, args = []) {
  const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
  return [cmd, ...args.map(q)].join(" ");
}

async function runExec(execFn, cmd, args, opts) {
  // Always prefer single-string to avoid arg parsing differences
  if (Array.isArray(args)) {
    const full = shellJoin(cmd, args);
    return execFn(full, opts);
  }
  return execFn(cmd, args);
}

async function hasWorkingChanges(execFn, cwd) {
  try {
    const out = await runExec(execFn, "git", ["status", "--porcelain"], { cwd });
    const text = String(out && out.stdout ? out.stdout : out);
    return text.trim().length > 0;
  } catch {
    return true;
  }
}

module.exports = {
  name: "self-rewrite",
  run: async ({ exec, proposeDiff, datetime }) => {
    if (typeof proposeDiff !== "function") {
      proposeDiff = async () => ({ ok: true, note: "fallback proposeDiff", edits: [] });
    }

    await git.assertClean();
    const branch = "autonomy/rewrite-" + datetime().toISOString().replace(/[:.]/g, "-");
    await git.checkoutNew(branch);

    const ALLOW = [
      "server/",
      "client/",
      "autonomy/",
      "package.json",
      "package-lock.json",
    ];

    const plan = await proposeDiff({
      goals: ["improve reliability", "reduce warnings", "enhance logs"],
      hard_guards: {
        path_allowlist: ALLOW,
        max_files: 10,
        max_total_change_bytes: 120000,
      },
    });

    let applied = 0;
    for (const e of (plan && plan.edits) || []) {
      const rel = String(e.path || "").replace(/\\/g, "/");
      if (!ALLOW.some((a) => rel === a || rel.startsWith(a))) continue;

      const abs = path.resolve(process.cwd(), e.path);
      const before = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : "";
      const after = typeof e.apply === "function" ? e.apply(before) : before;

      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, after, "utf8");

      applied += 1;
      if (applied >= 10) break;
    }

    // Format (best-effort)
    try {
      await runExec(exec, "npx", ["prettier", "--write", "."], { cwd: process.cwd() });
    } catch {
      try {
        const bin = path.resolve(
          process.cwd(),
          "node_modules",
          ".bin",
          process.platform === "win32" ? "prettier.cmd" : "prettier"
        );
        await runExec(exec, bin, ["--write", "."], { cwd: process.cwd() });
      } catch {}
    }

    // Lint (best-effort)
    try {
      await runExec(exec, "npm", ["run", "lint", "--", "--max-warnings=0"], { cwd: process.cwd() });
    } catch {}

    // Build client (best-effort)
    try {
      const client = path.resolve(process.cwd(), "client");
      await runExec(exec, "npm", ["run", "build"], { cwd: client });
    } catch {}

    // Stage & commit
    const cwd = process.cwd();
    try {
      const changed = await hasWorkingChanges(exec, cwd);
      if (changed) {
        await runExec(exec, "git", ["add", "-A"], { cwd });
        const raw = `self-rewrite: ${applied} edits`;
        // Force a single-string command with a quoted -m argument
        await runExec(exec, shellJoin("git", ["commit", "-m", raw]), null, { cwd });
        return { ok: true, note: `self-rewrite committed (${raw}) on ${branch}` };
      } else {
        return { ok: true, note: `self-rewrite made no changes; repo clean on ${branch}` };
      }
    } catch (e) {
      return { ok: false, note: `self-rewrite: git commit step failed: ${e && e.message ? e.message : e}` };
    }
  },
};
