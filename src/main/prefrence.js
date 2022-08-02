const { BrowserWindow } = require("electron");
import store from "../renderer/store/index";

function prefrence(top) {
  const winURL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:9080/#/prefrence`
      : `file://${__dirname}/index.html#/prefrence`;
  let mainWin = BrowserWindow.fromId(store.state.MainWindow.mainWindowId)

  const child = new BrowserWindow({
    parent: mainWin,
    show: false,
    titleBarStyle: "hidden",
  });
  child.loadURL(winURL);
  child.once("ready-to-show", () => {
    child.show();
  });
}

export { prefrence };
