const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer to the renderer process in a safe way
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});
