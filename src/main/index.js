"use strict";

import { app, BrowserWindow, Menu } from "electron";
import "../renderer/store";
import { prefrence } from "./prefrence";
import "./renderEvents";
import store from "../renderer/store/index";
import "./doenload";

if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 728,
    useContentSize: true,
    width: 1122,
    titleBarStyle: "hidden",
  });

  mainWindow.loadURL(winURL);
  store.dispatch("setMainWindowId", mainWindow.id);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createMenu() {
  const isMac = process.platform === "darwin";

  const template = [
    ...(isMac
      ? [
          {
            label: app.name || "m3u8",
            submenu: [
              // {
              //   label: "偏好设置",
              //   accelerator: process.platform === "darwin" ? "Cmd+P" : "Ctrl+P",
              //   click: async () => {
              //     prefrence();
              //   },
              // },
              { role: "quit", label: "退出" },
            ],
          },
        ]
      : []),
    {
      label: "编辑",
      submenu: [
        { role: "cut", label: "剪切" },
        { role: "copy", label: "复制" },
        { role: "paste", label: "粘贴" },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on("ready", () => {
  createWindow();
  createMenu();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
    createMenu();
  }
});
