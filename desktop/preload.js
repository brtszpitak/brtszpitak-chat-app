const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("alice", { version: "desktop-0.1.0" });
