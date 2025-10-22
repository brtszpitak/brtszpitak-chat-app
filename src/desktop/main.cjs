const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV !== "production";
const VITE_PORT = process.env.VITE_PORT || 5174;

function createWindow(){
  const win = new BrowserWindow({
    width: 1100, height: 800,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  if (isDev) {
    win.loadURL(`http://localhost:${VITE_PORT}/`);
  } else {
    const p = path.join(__dirname, "../../desktop/renderer/dist/index.html");
    win.loadFile(p);
  }
}
app.whenReady().then(() => { createWindow(); app.on("activate", () => BrowserWindow.getAllWindows().length === 0 && createWindow()); });
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
