import { app, ipcMain } from "electron";

ipcMain.on("getPath", (event, name) => {
    event.sender.send("getPath", app.getPath(name));
});
