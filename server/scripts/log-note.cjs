#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
try {
  const root = path.resolve(__dirname, "..", ".."); // repo root
  const notePath = path.join(root, "docs", "NEXT_PHASE_LOG.md");
  const ts = new Date().toISOString();
  const line = `- ${ts} - autonomy: creative tick complete [AUTO]\n`;
  fs.mkdirSync(path.dirname(notePath), { recursive: true });
  fs.appendFileSync(notePath, line, { encoding: "utf8" });
  process.stdout.write(`wrote ${notePath}\n`);
  process.exit(0);
} catch (err) {
  console.error("log-note failed:", (err && err.stack) || err);
  process.exit(1);
}
