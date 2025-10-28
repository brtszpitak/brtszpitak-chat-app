const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", ".."); // repo root from server/scripts
console.log("GATE: loaded", __filename);

function lintGreen() {
  if (fs.existsSync(path.join(root, ".lint-green"))) return true; // fast flag
  try {
    const p = path.join(root, "server", "logs", "lastLint.json"); // preferred
    if (fs.existsSync(p)) {
      const j = JSON.parse(fs.readFileSync(p, "utf8"));
      if (String(j.status || "").toLowerCase() === "ok") return true;
      if (j.ok === true) return true;
    }
  } catch {}
  try {
    const p = path.join(root, "server", "scripts", "storage.json"); // secondary
    if (fs.existsSync(p)) {
      const s = JSON.parse(fs.readFileSync(p, "utf8"));
      if (String(s.lastLint || "").toLowerCase() === "ok") return true;
    }
  } catch {}
  return false;
}

const LINT_OK = lintGreen();
console.log("GATE: lintGreen =", LINT_OK);

if (!LINT_OK) {
  console.log("skip pack (lint not green)");
  process.exit(0);
}

const desktop = path.join(root, "desktop-app");

function hasNpmScript(name) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(desktop, "package.json"), "utf8"));
    return pkg.scripts && Object.prototype.hasOwnProperty.call(pkg.scripts, name);
  } catch {
    return false;
  }
}

try {
  if (hasNpmScript("pack")) {
    execSync(`npm --prefix "${desktop}" run pack`, { stdio: "inherit" });
  } else {
    execSync(`npx --no-install electron-builder --dir --publish never`, {
      stdio: "inherit",
      cwd: desktop,
    });
  }
  process.exit(0);
} catch (e) {
  process.exitCode = e && (e.status || e.code) ? e.status || e.code : 1;
  throw e;
}
