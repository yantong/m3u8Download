import { app, ipcMain, BrowserWindow, dialog } from "electron";
import store from "../renderer/store/index";

ipcMain.on("getPath", (event, name) => {
  event.sender.send("getPath", app.getPath(name));
});

ipcMain.on("openDownloadPage", () => {
  const winURL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:9080/#/download`
      : `file://${__dirname}/index.html#/download`;
  let mainWin = BrowserWindow.fromId(store.state.MainWindow.mainWindowId);

  const child = new BrowserWindow({
    parent: mainWin,
    show: false,
    titleBarStyle: "hidden",
    useContentSize: true,
  });
  child.loadURL(winURL);
  child.once("ready-to-show", () => {
    child.show();
  });

  store.dispatch("setDownloadWindowId", child.id);
});

ipcMain.on("closeDownloadPage", () => {
  let downloadWindow = BrowserWindow.fromId(
    store.state.MainWindow.downloadWindowId
  );

  downloadWindow.close();
});

ipcMain.on("selDownloadPath", () => {
  dialog.showOpenDialog(
    {
      properties: ["openDirectory"],
    },
    (result) => {
      result && store.dispatch("setDownloadPath", result);
    }
  );
});
