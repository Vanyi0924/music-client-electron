import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  ipcRenderer,
  onFromMain: (opt: "on" | "off", callback: (...args: any) => void) => {
    if (opt === "on") {
      ipcRenderer.on("from-main", callback);
    } else {
      ipcRenderer.removeAllListeners("from-main");
    }
  },
});
