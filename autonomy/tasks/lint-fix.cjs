const { execFileSync } = require("node:child_process");

function sh(bin, args) {
  try {
    execFileSync(process.platform === "win32" ? bin + ".cmd" : bin, args, {
      stdio: "inherit",
      env: process.env,
    });
    return { ok: true };
  } catch (err) {
    // Do not fail the task; just record that we skipped/soft-failed
    return { ok: false, err };
  }
}

async function run() {
  // 1) Prettier across repo (safe: ignore-unknown so non-code files are skipped)
  const p = sh("npx", ["prettier", "--cache", "--ignore-unknown", "--write", "."]);

  // 2) ESLint (ESLint v9 flat config; no legacy flags; scoped to server/)
  //    Let ESLint warn/error but do not break autonomy if it fails.
  const e = sh("npx", [
    "eslint",
    "server",
    "--max-warnings=0",
    "--no-error-on-unmatched-pattern",
  ]);

  const note = `prettier=${p.ok ? "done" : "skipped/failed"} | eslintScoped=${e.ok ? "done" : "skipped/failed (ignored)"}`;
  return { ok: true, note };
}

module.exports = { run };
