/**
 * Self-rewrite task
 * - Runs Prettier (and ESLint if available)
 * - Stages only safe paths (guards against logs/builds/caches/etc.)
 * - Skips clean repos
 * - Commits with a clear, timestamped message
 *
 * Exit codes:
 *   0 = success (commit made OR nothing to do)
 *   1 = recoverable failure (should stop run_once)
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "..", ".."); // project root
process.chdir(root);

function run(cmd, args = [], opts = {}) {
  const r = spawnSync(cmd, args, { stdio: "pipe", encoding: "utf-8", ...opts });
  if (r.error) throw r.error;
  return r;
}

function ok(r) {
  return r.status === 0;
}

function log(...a) {
  console.log("[self-rewrite]", ...a);
}

function now() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function gitSafe() {
  const gv = run("git", ["--version"]);
  if (!ok(gv)) throw new Error("git not available");
  // Ensure we're inside a git repo
  const gr = run("git", ["rev-parse", "--is-inside-work-tree"]);
  if (!ok(gr) || gr.stdout.trim() !== "true") {
    throw new Error("not inside a git work tree");
  }
}

function getPorcelain() {
  const s = run("git", ["status", "--porcelain"]);
  if (!ok(s)) throw new Error("git status failed");
  return s.stdout.trim();
}

function stageAll() {
  const add = run("git", ["add", "-A"]);
  if (!ok(add)) throw new Error("git add failed");
}

function unstageForbidden() {
  // Hardened guardrails: never stage these paths
  const patterns = [
    "node_modules/",
    "dist/",
    "build/",
    "out/",
    ".next/",
    ".cache/",
    ".parcel-cache/",
    "coverage/",
    "logs/",
    "log/",
    "releases/",
    "downloads/",
    "tmp/",
    "temp/",
    "*.log",
    "*.tmp",
    "*.lock",
    "*.pid",
    ".DS_Store",
    "Thumbs.db",
    // project-specific
    "server/state.json",
    "client/dist/",
    "desktop/dist/",
    "autonomy_heartbeat.txt",
  ];

  // We use `git restore --staged` (safe even if pattern matches nothing)
  for (const p of patterns) {
    run("git", ["restore", "--staged", "--worktree", "--", p]);
  }
}

function hasDiff() {
  return getPorcelain().length > 0;
}

function prettier() {
  // Prefer local prettier; fall back to npx
  const localPrettier = existsSync(resolve("node_modules/.bin/prettier"))
    ? resolve("node_modules/.bin/prettier")
    : null;

  const args = ["--write", "."];
  let r;
  if (localPrettier) {
    r = run(localPrettier, args, { shell: process.platform === "win32" });
  } else {
    // use --yes to avoid interactive prompts
    r = run("npx", ["--yes", "prettier", ...args], {
      shell: process.platform === "win32",
    });
  }
  if (!ok(r)) throw new Error("prettier --write failed");
  log("prettier formatted files");
}

function eslintFixIfAvailable() {
  // Try to run eslint if installed; otherwise silently skip
  const localESLint = existsSync(resolve("node_modules/.bin/eslint"))
    ? resolve("node_modules/.bin/eslint")
    : null;

  if (!localESLint) {
    log("eslint not found; skipping eslint --fix");
    return;
  }

  const r = run(localESLint, [".", "--fix"], {
    shell: process.platform === "win32",
  });
  if (!ok(r)) {
    // Non-fatal: formatting can be enough for this task
    log("eslint --fix returned non-zero; continuing anyway");
    return;
  }
  log("eslint --fix applied");
}

function commit() {
  // Ensure user.name/email exist (non-fatal if missing; git will fail if truly required)
  run("git", ["config", "--get", "user.name"]);
  run("git", ["config", "--get", "user.email"]);

  const message = `autonomy(self-rewrite): format & tidy @ ${now()}`;
  const c = run("git", ["commit", "-m", message]);
  if (!ok(c)) {
    const out = (c.stdout || "") + "\n" + (c.stderr || "");
    if (/nothing to commit/i.test(out)) {
      log("nothing to commit (clean after guards)");
      return false;
    }
    throw new Error("git commit failed");
  }
  log("commit created:", message.trim());
  return true;
}

async function main() {
  try {
    gitSafe();

    // If working tree is *already* dirty before we start, that's ok — we will try to normalize.
    log("starting on branch:");
    const bn = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    if (ok(bn)) log(bn.stdout.trim());

    // 1) Format
    prettier();
    eslintFixIfAvailable();

    // 2) Stage everything, then unstage forbidden paths (hard guardrails)
    stageAll();
    unstageForbidden();

    // 3) If nothing staged/changed, exit gracefully
    if (!hasDiff()) {
      log("no safe changes detected after formatting — skip commit");
      process.exit(0);
    }

    // 4) Commit
    const madeCommit = commit();

    if (!madeCommit) {
      log("finished with no commit (likely guards removed all staged changes)");
      process.exit(0);
    }

    // Optional: don’t push automatically; local autonomy only.
    process.exit(0);
  } catch (err) {
    console.error("[self-rewrite] ERROR:", err?.message || err);
    process.exit(1);
  }
}

main();
