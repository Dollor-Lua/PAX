const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("pax", {
    close: () => ipcRenderer.send("close"),
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.send("maximize"),
    execute: (exec) => ipcRenderer.send("execute", exec),
});
