"use strict";

const path = require("node:path");
const { execSync } = require("node:child_process");

function commitIfDirty(msg = "chore: auto-baseline after note-progress") {
  const out = execSync("git status --porcelain", { encoding: "utf8" }).trim();
  if (out) {
    execSync("git add -A", { stdio: "inherit" });
    const safe = String(msg).replace(/"/g, '\\"');
    try {
      execSync('git commit -m "' + safe + '"', { stdio: "inherit" });
    } catch {}
  }
}

async function runTask(name) {
  console.log(`=== RUN ${name} ===`);
  const modPath = path.join(__dirname, "tasks", `${name}.cjs`);
  const mod = require(modPath);
  const res = await mod.run();
  console.log(`[task ${name}]`, res);
  return res;
}

(async () => {
  await runTask("lint-fix");
  await runTask("audit-server");
  await runTask("build-client");
  await runTask("smoke-endpoints");
  await runTask("note-progress");
  commitIfDirty(); // keep tree clean before self-rewrite
  await runTask("self-rewrite");
  console.log("All tasks complete.");
})().catch(e => { console.error(e); process.exit(1); });
