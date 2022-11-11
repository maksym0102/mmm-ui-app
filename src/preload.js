const { contextBridge, ipcRenderer } = require("electron");
const { BROWSER_EVENTS } = require("./modules/constants");
window.ipcRenderer = ipcRenderer;

const validChannels = [
  BROWSER_EVENTS.READ_FILE,
  BROWSER_EVENTS.WRITE_FILE,
  BROWSER_EVENTS.BUILD,
];
contextBridge.exposeInMainWorld("ipc", {
  invoke: async (channel, data) => {
    return await ipcRenderer.invoke(channel, data);
  },
  on: (channel, func) => {
    if (validChannels.includes(channel)) {
      // Strip event as it includes `sender` and is a security risk
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
