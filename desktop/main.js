import { app, BrowserWindow, dialog } from "electron";
import { spawn } from "child_process";
import path from "path";
import url from "url";
import http from "http";

let mainWindow;
let serverChild = null;
let startedServer = false;

function ping(urlStr, timeoutMs = 350) {
  return new Promise((resolve) => {
    const req = http.get(urlStr, () => resolve(true)).on("error", () => resolve(false));
    req.setTimeout(timeoutMs, () => { req.destroy(); resolve(false); });
  });
}

async function ensureServer() {
  if (await ping("http://localhost:3001/health")) return;
  const serverPath = path.join(process.resourcesPath, "app", "server", "index.js");
  serverChild = spawn(process.execPath, [serverPath], {
    stdio: "ignore",
    windowsHide: true,
    env: { ...process.env, NODE_ENV: "production", PORT: "3001" }
  });
  startedServer = true;
  const startedAt = Date.now();
  while (Date.now() - startedAt < 30000) {
    if (await ping("http://localhost:3001/health")) return;
    await new Promise((r) => setTimeout(r, 500));
  }
  dialog.showErrorBox("Alice Chat", "Server did not start in time.");
}

async function createWindow() {
  await ensureServer();
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    webPreferences: {
      preload: path.join(app.getAppPath(), "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  const clientIndex = url.pathToFileURL(path.join(process.resourcesPath, "app", "client", "index.html")).toString();
  await mainWindow.loadURL(clientIndex);
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("second-instance", () => { if (mainWindow) mainWindow.focus(); });
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("before-quit", () => { if (startedServer && serverChild) { try { serverChild.kill(); } catch {} } });
