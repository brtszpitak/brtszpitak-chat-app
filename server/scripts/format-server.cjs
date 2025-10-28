#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");
const root = path.resolve(__dirname, "..", "..");
const ignore = path.join(root, ".prettierignore");

try {
  console.log("→ prettier write (server/*) with ignore:", ignore);
  execSync(
    `npx prettier "server/**/*.{js,cjs,ts,tsx,json,md,css}" --write --ignore-path "${ignore}"`,
    { stdio: "inherit", cwd: root }
  );
  process.exit(0);
} catch (e) {
  console.error("format-server failed:", e?.message || e);
  process.exit(2);
}
