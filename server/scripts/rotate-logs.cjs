const fs = require("fs");
const path = require("path");

const LOGS = path.join(__dirname, "..", "logs");
const KEEP_DAYS = 7;
const cutoff = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;

if (!fs.existsSync(LOGS)) process.exit(0);

for (const f of fs.readdirSync(LOGS)) {
  const p = path.join(LOGS, f);
  try {
    const s = fs.statSync(p);
    if (s.isFile() && s.mtimeMs < cutoff && (f.endsWith(".ndjson") || f.endsWith(".json"))) {
      fs.unlinkSync(p);
      console.log("rotated:", f);
    }
  } catch {}
}
