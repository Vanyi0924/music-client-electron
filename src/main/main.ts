import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { resolve } from "path";
import { createDebugLogger, debugLogger } from "./logs";
import electronConfig from "../../electron-vue.config";

/**
 * @description 注入环境变量
 * process.env[attr] 值只能为字符串
 */
// electron 是否打包
process.env.GLOBAL_IS_PACKAGED = app.isPackaged ? "1" : "0";
// electron 的appPath
process.env.GLOBAL_ENV_PWD = app.getAppPath();

// 载入配置 start
const { main } = electronConfig();
const { browserWindowSize, loadURL } = app.isPackaged ? main.prod : main.dev;
// 初始化日志实例
createDebugLogger();
// 初始化数据库
debugLogger.info("启动客户端");
// 载入配置 end

const isMac = process.platform === "darwin";

let win: BrowserWindow;
const createWindow = async () => {
  win = new BrowserWindow({
    width: browserWindowSize.minWidth,
    height: browserWindowSize.height,
    minWidth: browserWindowSize.minWidth,
    minHeight: browserWindowSize.minHeight,
    titleBarStyle: isMac ? "hidden" : "default",
    trafficLightPosition: {
      x: 16,
      y: 25,
    },
    webPreferences: {
      preload: resolve(__dirname, "preload.js"),
    },
  });

  win.setMenuBarVisibility(false);
  if (app.isPackaged) {
    win.loadFile(resolve(process.env.GLOBAL_ENV_PWD, loadURL));
  } else {
    win.loadURL(loadURL);
  }
  return win;
};

app
  .whenReady()
  .then(async () => {
    await createWindow();
  })
  .catch((err) => {
    console.log(err);
  });

/**
 * 设置菜单
 */
// https://www.electronjs.org/zh/docs/latest/api/menu#examples
// @ts-ignore
const menu = Menu.buildFromTemplate([
  {
    label: "electron + vue3",
    submenu: [
      { role: "copy", label: "复制" },
      { role: "cut", label: "剪切" },
      { role: "paste", label: "粘贴" },
      { role: "selectAll", label: "全选" },
      { type: "separator" },
      { role: "toggleDevTools", label: "开发者工具", visible: true },
      { role: "about", label: "关于" },
      { role: "quit", label: "退出" },
    ],
  },
]);

Menu.setApplicationMenu(menu);
