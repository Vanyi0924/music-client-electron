interface Window {
  electronAPI: {
    ipcRenderer: Electron.IpcRenderer;
    onFromMain: (opt: "on" | "off", callback: (...args: any) => void) => void;
  };
}
