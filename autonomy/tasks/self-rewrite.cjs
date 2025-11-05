const path = require("path");
const fs = require("fs");
const git = require("../lib/git.cjs");

// --- helpers ---------------------------------------------------------------
function shellJoin(cmd, args = []) {
  const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
  return [cmd, ...args.map(q)].join(" ");
}

async function textOut(promise) {
  const r = await promise;
  return String(r && r.stdout ? r.stdout : r).trim();
}

async function runExec(execFn, cmd, args, opts) {
  // Prefer single-string to avoid Windows arg parsing quirks
  if (Array.isArray(args)) return execFn(shellJoin(cmd, args), opts);
  return execFn(cmd, args);
}

async function hasWorkingChanges(execFn, cwd) {
  try {
    const s = await textOut(runExec(execFn, "git", ["status", "--porcelain"], { cwd }));
    return s.length > 0;
  } catch {
    // Be conservative
    return true;
  }
}

async function hasStagedChanges(execFn, cwd) {
  const s = await textOut(runExec(execFn, "git", ["diff", "--cached", "--name-only"], { cwd }));
  return s.length > 0;
}

async function stagedList(execFn, cwd) {
  const s = await textOut(runExec(execFn, "git", ["diff", "--cached", "--name-only"], { cwd }));
  return s.split(/\r?\n/).filter(Boolean);
}

async function ensureLocalIdentity(execFn, cwd) {
  // Set a local identity if not already set (avoids commit rejection on fresh clones)
  try {
    const name = await textOut(runExec(execFn, "git", ["config", "--get", "user.name"], { cwd }));
    const email = await textOut(runExec(execFn, "git", ["config", "--get", "user.email"], { cwd }));
    if (!name) await runExec(execFn, "git", ["config", "user.name", "Alice Bot"], { cwd });
    if (!email) await runExec(execFn, "git", ["config", "user.email", "alice@example.local"], { cwd });
  } catch { /* ignore */ }
}

// --- task ------------------------------------------------------------------
module.exports = {
  name: "self-rewrite",
  run: async ({ exec, proposeDiff, datetime }) => {
    if (typeof proposeDiff !== "function") {
      // Safe fallback: propose nothing
      proposeDiff = async () => ({ ok: true, note: "fallback proposeDiff", edits: [] });
    }

    const cwd = process.cwd();

    const ALLOW = [
      "server/",
      "client/",
      "autonomy/",
      "package.json",
      "package-lock.json",
    ];

    // Ask for suggested edits (guarded)
    const plan = await proposeDiff({
      goals: ["improve reliability", "reduce warnings", "enhance logs"],
      hard_guards: {
        path_allowlist: ALLOW,
        max_files: 10,
        max_total_change_bytes: 120000,
      },
    });

    // Apply up to 10 guarded edits
    let applied = 0;
    for (const e of (plan && plan.edits) || []) {
      const rel = String(e.path || "").replace(/\\/g, "/");
      if (!ALLOW.some((a) => rel === a || rel.startsWith(a))) continue;

      const abs = path.resolve(cwd, e.path);
      const before = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : "";
      const after = typeof e.apply === "function" ? e.apply(before) : before;

      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, after, "utf8");

      applied += 1;
      if (applied >= 10) break;
    }

    // Format (best-effort)
    try {
      await runExec(exec, "npx", ["prettier", "--write", "."], { cwd });
    } catch {
      try {
        const bin = path.resolve(
          cwd,
          "node_modules",
          ".bin",
          process.platform === "win32" ? "prettier.cmd" : "prettier"
        );
        await runExec(exec, bin, ["--write", "."], { cwd });
      } catch {}
    }

    // Lint (best-effort)
    try {
      await runExec(exec, "npm", ["run", "lint", "--", "--max-warnings=0"], { cwd });
    } catch {}

    // Build client (best-effort)
    try {
      await runExec(exec, "npm", ["run", "build"], { cwd: path.resolve(cwd, "client") });
    } catch {}

    // If absolutely nothing changed, exit early without creating a branch
    const workingChanged = await hasWorkingChanges(exec, cwd);
    if (!workingChanged) {
      return { ok: true, note: "self-rewrite: no changes; repo clean (skipped branch/commit)" };
    }

    // Create a fresh topic branch just before we stage/commit
    await git.assertClean(); // ensure nothing untracked is already staged on current branch
    const branch = "autonomy/rewrite-" + datetime().toISOString().replace(/[:.]/g, "-");
    await git.checkoutNew(branch);

    // Stage everything and commit only if there is something staged
    await runExec(exec, "git", ["add", "-A"], { cwd });
    const staged = await hasStagedChanges(exec, cwd);
    if (!staged) {
      return { ok: true, note: `self-rewrite: nothing staged after add; skipping commit on ${branch}` };
    }

    await ensureLocalIdentity(exec, cwd);

    const msg = `self-rewrite: ${applied} edits`;
    try {
      await runExec(exec, "git", ["commit", "-m", msg], { cwd });
      return { ok: true, note: `self-rewrite committed (${msg}) on ${branch}` };
    } catch (e) {
      // Graceful degrade (do not fail the pipeline)
      const head = await textOut(runExec(exec, "git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd }));
      const stagedNow = await textOut(runExec(exec, "git", ["diff", "--cached", "--name-only"], { cwd }));
      const stagedTail = String(stagedNow).split(/\r?\n/).filter(Boolean).slice(0, 5).join(", ");
      return {
        ok: true,
        note: `self-rewrite: commit skipped (git refused). branch=${head} staged=[${stagedTail}] msg="${msg}"`,
      };
    }
  },
};
