/* server/scripts/patch-runner-note-guard.cjs */
const fs = require("fs"),
  path = require("path");
const file = path.join(__dirname, "..", "autonomy", "tick.js");
let s = fs.readFileSync(file, "utf8");
if (!s.includes("// injected guard: run note-progress via script")) {
  s = s.replace(
    /function\s+runTask\s*\(([^)]*)\)\s*{/,
    (m) =>
      m +
      `
  // injected guard: run note-progress via script
  if (task && (task.id||task.name)==='note-progress') {
    const { execSync } = require('child_process');
    try {
      const out = execSync('node server/scripts/note-progress.cjs', {
        cwd: path.resolve(__dirname, '..'), stdio: ['ignore','pipe','pipe']
      });
      process.stdout.write(out.toString());
      return { code: 0 };
    } catch (e) {
      if (e.stdout) process.stdout.write(e.stdout.toString());
      if (e.stderr) process.stderr.write(e.stderr.toString());
      return { code: e.status || 1 };
    }
  }
`
  );
  fs.writeFileSync(file, s);
  console.log("patched", file);
} else {
  console.log("already patched", file);
}
