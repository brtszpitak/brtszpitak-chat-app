const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let win;
let pttDown = false;

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 720,
    backgroundColor: '#101114',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  // F9 push-to-talk
  globalShortcut.register('F9', () => {
    pttDown = !pttDown;
    win.webContents.send('ptt-toggle', pttDown);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
