const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function sh(cmd, args=[], opts={}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { shell: true, stdio: "inherit", ...opts });
    p.on("close", (code) => code===0 ? resolve() : reject(new Error(`${cmd} exit ${code}`)));
  });
}

function hasFile(p) {
  try { return fs.existsSync(p) && fs.statSync(p).isFile(); } catch { return false; }
}
function hasDir(p) {
  try { return fs.existsSync(p) && fs.statSync(p).isDirectory(); } catch { return false; }
}

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p,"utf8")); } catch { return null; }
}

function looksLikeVite(client) {
  if (hasFile(path.join(client,"vite.config.ts")) || hasFile(path.join(client,"vite.config.js"))) return true;
  const pkg = readJson(path.join(client,"package.json")) || {};
  const deps = {...(pkg.dependencies||{}), ...(pkg.devDependencies||{})};
  return !!(deps.vite || deps["@vitejs/plugin-react"] || deps["@vitejs/plugin-react-swc"]);
}

function looksLikeCRA(client) {
  const pkg = readJson(path.join(client,"package.json")) || {};
  const deps = {...(pkg.dependencies||{}), ...(pkg.devDependencies||{})};
  return !!deps["react-scripts"];
}

function looksLikeNext(client) {
  const pkg = readJson(path.join(client,"package.json")) || {};
  const deps = {...(pkg.dependencies||{}), ...(pkg.devDependencies||{})};
  return !!deps.next;
}

async function buildClient(client) {
  if (!hasDir(client)) throw new Error(`Client dir missing: ${client}`);
  const pkgPath = path.join(client, "package.json");
  const pkg = readJson(pkgPath) || {};
  const scripts = pkg.scripts || {};

  // 1) If script exists, trust it
  if (scripts.build) {
    await sh("npm", ["run","build"], { cwd: client });
  } else if (looksLikeVite(client)) {
    // 2) Vite fallback
    await sh("npx", ["vite","build"], { cwd: client });
  } else if (looksLikeCRA(client)) {
    // 3) CRA fallback
    await sh("npx", ["react-scripts","build"], { cwd: client });
  } else if (looksLikeNext(client)) {
    // 4) Next.js fallback
    await sh("npx", ["next","build"], { cwd: client });
  } else {
    throw new Error("No known build method (no scripts.build, no Vite/CRA/Next detected).");
  }

  // Verify output folder (try common names)
  const candidates = ["dist","build",".next","out"].map(d => path.join(client, d));
  const found = candidates.find(hasDir);
  if (!found) throw new Error("Client build finished but no dist/build/.next/out folder found");
  return path.basename(found);
}

module.exports = {
  name: "build-client",
  run: async ({ exec }) => {
    const client = path.resolve(process.cwd(), "client");
    const outDir = await buildClient(client);
    return { ok: true, note: `Client build ok → ${outDir}` };
  }
};
