const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..", "..");
const dist = path.join(root, "desktop-app", "dist");

try {
  if (fs.existsSync(dist)) {
    console.log("desktop-app/dist already exists - skipping rebuild.");
    process.exit(0);
  }
  let used = "electron-builder";
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    const hasPackDesktop = pkg?.scripts?.["pack:desktop"];
    const hasPack = pkg?.scripts?.["pack"];
    if (hasPackDesktop || hasPack) {
      used = hasPackDesktop ? "npm run pack:desktop" : "npm run pack";
      execSync(used, { stdio: "inherit", cwd: root });
    } else {
      execSync("npx electron-builder -w", {
        stdio: "inherit",
        cwd: path.join(root, "desktop-app"),
      });
    }
  } catch (e) {
    execSync("npx electron-builder -w", { stdio: "inherit", cwd: path.join(root, "desktop-app") });
  }
  console.log("pack-desktop done.");
  process.exit(0);
} catch (e) {
  console.error("pack-desktop failed:", e?.message || e);
  process.exit(2);
}
