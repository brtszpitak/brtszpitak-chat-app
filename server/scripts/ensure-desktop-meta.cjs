/* ensure-desktop-meta.cjs */
const fs = require("fs"),
  path = require("path");
const desk = process.argv[2];
const pkgPath = path.join(desk, "package.json");
const raw = fs.readFileSync(pkgPath, "utf8").replace(/^\uFEFF/, "");
const j = JSON.parse(raw);

j.description =
  j.description && String(j.description).trim() ? j.description : "Alice Chat desktop app";
j.author = j.author && String(j.author).trim() ? j.author : "Bartosz";

j.build = j.build || { asar: true };
j.build.appId = j.build.appId || "com.alice.chatapp";

j.build.win = j.build.win || {};
j.build.win.target = j.build.win.target || ["nsis"];
// only set icon if file exists; otherwise let electron-builder use default
try {
  const maybeIcon = path.join(desk, "build", "icon.ico");
  if (fs.existsSync(maybeIcon)) j.build.win.icon = "build/icon.ico";
} catch {}

j.build.nsis = j.build.nsis || {};
if (typeof j.build.nsis.oneClick === "undefined") j.build.nsis.oneClick = true;
if (typeof j.build.nsis.perMachine === "undefined") j.build.nsis.perMachine = false;
j.build.nsis.shortcutName = j.build.nsis.shortcutName || "Alice Chat";
j.build.nsis.artifactName = j.build.nsis.artifactName || "Alice Chat Setup ${version}.${ext}";

fs.writeFileSync(pkgPath, JSON.stringify(j, null, 2) + "\n", "utf8");
process.stdout.write("desktop meta ok\n");
