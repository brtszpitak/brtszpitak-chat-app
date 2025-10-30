$ErrorActionPreference = "Stop"
Set-Location "D:\Alice\projects\chat-app"

# Ensure autonomy\lib exists
New-Item -ItemType Directory -Force ".\autonomy\lib" | Out-Null

# Write autonomy\lib\git.cjs (CommonJS helper; allows empty commits)
@"
const { spawn } = require("child_process");
function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { shell: true, ...opts });
    let out = "", err = "";
    p.stdout.on("data", d => out += d);
    p.stderr.on("data", d => err += d);
    p.on("close", c => c === 0 ? resolve({ out, err }) : reject(new Error(err || `exit ${c}`)));
  });
}
module.exports = {
  assertClean: async () => {
    const { out } = await run("git", ["status","--porcelain"]);
    if (out.trim()) throw new Error("Working tree not clean");
  },
  checkoutNew: async (name) => { await run("git", ["checkout","-b", name]); },
  addAll: async () => { await run("git", ["add","."]); },
  commit: async (msg) => { await run("git", ["commit","-m", msg, "--allow-empty"]); },
};
"@ | Set-Content -Encoding UTF8 ".\autonomy\lib\git.cjs"

# Point self-rewrite task at the CJS helper
$p = ".\autonomy\tasks\self-rewrite.cjs"
$t = Get-Content $p -Raw
$t = $t -replace '\.\./lib/git(["'+"'])','../lib/git.cjs$1'
Set-Content -Encoding UTF8 $p $t

# Commit so assertClean() passes
git add autonomy\lib\git.cjs autonomy\tasks\self-rewrite.cjs
git commit -m "fix(autonomy): use CJS git helper and allow empty commits" --allow-empty

# Run autonomy batch (resolve Node explicitly to avoid PATH weirdness)
$node = (Get-Command node).Source
& $node ".\autonomy\run_once.cjs"
