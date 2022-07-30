const { BrowserWindow } = require("electron");

function prefrence(top) {
  const winURL =
    process.env.NODE_ENV === "development"
      ? `http://localhost:9080/#/prefrence`
      : `file://${__dirname}/index.html#/prefrence`;

  const child = new BrowserWindow({
    parent: top,
    show: false,
    titleBarStyle: "hidden",
  });
  child.loadURL(winURL);
  child.once("ready-to-show", () => {
    child.show();
  });
}

export { prefrence };
