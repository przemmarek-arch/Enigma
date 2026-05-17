const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  encryptFile: (filePath, password) => 
    ipcRenderer.invoke('encrypt-file', filePath, password),
  decryptFile: (encryptedData, password) => 
    ipcRenderer.invoke('decrypt-file', encryptedData, password),
  selectFile: () => 
    ipcRenderer.invoke('select-file'),
  saveFile: (fileName) => 
    ipcRenderer.invoke('save-file', fileName)
});
