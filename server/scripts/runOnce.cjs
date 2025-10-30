#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");
const args = process.argv.slice(2);
if (args.length === 0) {
  process.stderr.write("Usage: runOnce cmd [args...]\n");
  process.exit(2);
}
const cmd = args[0],
  cmdArgs = args.slice(1);
const res = spawnSync(cmd, cmdArgs, {
  shell: false,
  stdio: "inherit",
  cwd: path.resolve(__dirname, ".."),
  env: process.env,
});
process.exit(res.status === null ? 1 : res.status);
