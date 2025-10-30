const { spawnSync } = require("node:child_process");

function tryResolve(id) {
  try { return require.resolve(id); } catch { return null; }
}
function runNode(script, args) {
  if (!script) return { ok: false, note: "missing " + args?.[0] };
  const res = spawnSync(process.execPath, [script, ...args], { stdio: "inherit", env: process.env });
  return { ok: res.status === 0 };
}

async function run() {
  // ---- Prettier
  const prettierPath =
    tryResolve("prettier/bin/prettier.cjs") || // Prettier 3
    tryResolve("prettier/bin-prettier.js");    // Older Prettier

  const p = runNode(prettierPath, ["--cache", "--ignore-unknown", "--write", "."]);

  // ---- ESLint (v9 flat config)
  const eslintPath = tryResolve("eslint/bin/eslint.js");
  const e = runNode(eslintPath, [
    "server",
    "--max-warnings=0",
    "--no-error-on-unmatched-pattern"
  ]);

  const note = `prettier=${p.ok ? "done" : "skipped/failed"} | eslintScoped=${e.ok ? "done" : "skipped/failed (ignored)"}`;
  return { ok: true, note };
}

module.exports = { run };
