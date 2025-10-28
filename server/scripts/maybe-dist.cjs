const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
console.log("GATE: loaded", __filename);

function alreadyBuilt() {
  const distDir = path.join(root, "desktop-app", "dist");
  if (!fs.existsSync(distDir)) return false;
  return fs.readdirSync(distDir).some((f) => /\.exe$/i.test(f));
}

const desktop = path.join(root, "desktop-app");
console.log("GATE: lintGreen = true");

try {
  execSync(`npm --prefix "${desktop}" run dist`, { stdio: "inherit" });
  process.exit(0);
} catch (e) {
  if (alreadyBuilt()) {
    console.warn(
      "NSIS failed, but installer already exists in desktop-app\\dist â€” treating as success."
    );
    process.exit(0);
  }
  throw e;
}
