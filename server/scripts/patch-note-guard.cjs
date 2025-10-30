const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "autonomy", "tick.js");
let s = fs.readFileSync(file, "utf8");

// Idempotent: skip if already patched
if (s.includes("__NOTE_PROGRESS_GUARD__")) {
  console.log("already patched", file);
  process.exit(0);
}

// Find the runTask function opening brace and insert our guard right after it
const marker = "function runTask";
const i = s.indexOf(marker);
if (i < 0) {
  console.error("runTask() not found in", file);
  process.exit(2);
}
const brace = s.indexOf("{", i);
if (brace < 0) {
  console.error("opening brace not found after runTask in", file);
  process.exit(3);
}

const inject = `
  // __NOTE_PROGRESS_GUARD__
  if (task && (task.id || task.name) === "note-progress") {
    const { execSync } = require("child_process");
    try {
      const out = execSync("node server/scripts/note-progress.cjs", {
        cwd: require("path").resolve(__dirname, ".."), // -> server/
        stdio: ["ignore", "pipe", "pipe"],
      });
      process.stdout.write(out.toString());
      return { code: 0 };
    } catch (e) {
      if (e.stdout) process.stdout.write(String(e.stdout));
      if (e.stderr) process.stderr.write(String(e.stderr));
      return { code: e.status || 1 };
    }
  }
`;

const patched = s.slice(0, brace + 1) + inject + s.slice(brace + 1);
fs.writeFileSync(file, patched);
console.log("patched", file);
