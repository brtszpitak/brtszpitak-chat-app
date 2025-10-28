const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('alice', {
  onPTT: (cb) => ipcRenderer.on('ptt-toggle', (_, v) => cb(v)),
});
