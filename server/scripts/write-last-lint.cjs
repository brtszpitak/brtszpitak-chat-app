/* scripts/write-last-lint.cjs */
const fs = require("fs"),
  path = require("path");
const server = process.argv[2];
const logs = path.join(server, "logs");
fs.mkdirSync(logs, { recursive: true });
let ok = process.argv[3] === "ok";
fs.writeFileSync(
  path.join(logs, "lastLint.json"),
  JSON.stringify({ ok, ts: new Date().toISOString() }, null, 2)
);
