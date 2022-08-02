import { ipcMain, BrowserWindow } from "electron";
import store from "../renderer/store/index";
import axios from "axios";
import * as fs from "fs";

let doenloadMissions = {
  //   url: [
  //     {
  //       tsUrl: "",
  //       status: "STATUS_BEGIN",
  //     },
  //   ],
};

let STATUS_BEGIN = "STATUS_BEGIN";
let STATUS_DOWNLOADING = "STATUS_DOWNLOADING";
let STATUS_END = "STATUS_END";
let ALL_USER_READ_WRITE = 511;
let DOWNLOAD_SAME_TIME_COUNT = 3;
let DOWNLOAD_MISSION_COUNT = 10;

let willDownloadStack = [];
let dounloadingStack = [];

ipcMain.on("download", (event, url) => {
  let mainWin = BrowserWindow.fromId(store.state.MainWindow.mainWindowId);

  mainWin.webContents.send("downloadReady");

  downloadM3u8(url);
});

function getDomain(targetURL, baseURL) {
  baseURL = baseURL || location.href;
  if (targetURL.indexOf("http") === 0) {
    return targetURL;
  } else if (targetURL[0] === "/") {
    let domain = baseURL.split("/");
    return domain[0] + "//" + domain[2] + "/" + targetURL;
  } else {
    let domain = baseURL.split("/");
    domain.pop();
    return domain.join("/") + "/" + targetURL;
  }
}

function deleFile(path, parentPath) {
  if (fs.statSync(path).isDirectory()) {
    let files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let currentPath = path + "/" + file;
      if (fs.statSync(currentPath).isDirectory()) {
        deleFile(currentPath, path);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    if (path != parentPath) {
      fs.rmdirSync(path);
    }
  } else {
    fs.unlinkSync(path);
  }
}

async function downloadM3u8(url) {
  let res = await axios.get(url, {});
  let splits = url.split("/");
  let path = splits[splits.length - 1].split(".m3u8")[0];


  if (res && res.data) {
    let tsUrls = res.data.split("\n").filter((item) => {
      return item.indexOf(".ts") >= 0 || item.indexOf("http") >= 0;
    });

    doenloadMissions[url] = tsUrls.map((item) => {
      let tsUrl = getDomain(item, url);

      return {
        tsUrl,
        status: STATUS_BEGIN,
      };
    });

    if (dounloadingStack.length < DOWNLOAD_SAME_TIME_COUNT) {
      dounloadingStack.push(doenloadMissions[url]);
      downloadTs(doenloadMissions[url], path);
    } else {
      willDownloadStack.push(doenloadMissions[url]);
    }
  }
}

function makeDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.chmodSync(dir, ALL_USER_READ_WRITE);
  } else {
    deleFile(dir);

    fs.mkdirSync(dir);
    fs.chmodSync(dir, ALL_USER_READ_WRITE);
  }
}

function downloadMission({ tsUrlsItem, tsUrls, dir }) {
  tsUrlsItem.status = STATUS_DOWNLOADING;

  return axios
    .get(tsUrlsItem.tsUrl, {
      responseType: "arraybuffer",
    })
    .then((res) => {
      let splits = tsUrlsItem.tsUrl.split("/");
      let filename = splits[splits.length - 1];
      let file = dir + "/" + filename;

      fs.writeFileSync(file, res.data);
      fs.chmodSync(file, ALL_USER_READ_WRITE);

      tsUrlsItem.status = STATUS_END;

      downloadTsComplete(tsUrls, dir);
    })
    .catch(() => {
      let index = tsUrls.findIndex((item) => item.tsUrl == tsUrlsItem.tsUrl);
      let downloadItem = tsUrls.find((item) => item.status == STATUS_BEGIN);

      tsUrls.splice(index, 1);
      downloadItem &&
        downloadMission({
          tsUrlsItem: downloadItem,
          tsUrls,
          dir,
        });
    });
}

function downloadTsComplete(tsUrls, dir) {
  let nameSplits = dir.split("/");
  let tsUrlsItem = tsUrls.find((item) => item.status == STATUS_BEGIN);
  let endItems = tsUrls.filter((item) => item.status == STATUS_END);
  let mainWin = BrowserWindow.fromId(store.state.MainWindow.mainWindowId);
  let process = (endItems.length / tsUrls.length) * 100;

  mainWin.webContents.send("downloadProcess", {
    name: nameSplits[nameSplits.length - 1],
    process: parseInt(process),
  });

  if (!tsUrlsItem) {
    downloadComplete(tsUrls, dir);
  } else {
    downloadMission({
      tsUrlsItem,
      tsUrls,
      dir,
    });
  }
}

function combinFile(tsUrls, dir) {
  let splits = dir.split("/");
  let name =
    splits.slice(0, splits.length - 1).join("/") +
    "/" +
    splits[splits.length - 1] +
    ".ts";

  for (let index = 0; index < tsUrls.length; index++) {
    let fileSplits = tsUrls[index].tsUrl.split("/");
    fs.appendFileSync(
      name,
      fs.readFileSync(dir + "/" + fileSplits[fileSplits.length - 1])
    );
  }

  deleFile(dir);

  let mainWin = BrowserWindow.fromId(store.state.MainWindow.mainWindowId);
  mainWin.webContents.send("downloadEnd", splits[splits.length - 1]);
}

function downloadComplete(tsUrls, dir) {
  let nextMission = willDownloadStack.length && willDownloadStack.splice(0, 1);
  let index = dounloadingStack.indexOf(tsUrls);

  dounloadingStack.splice(index, 1);
  nextMission && dounloadingStack.pusn(nextMission);

  combinFile(tsUrls, dir);
}

function download(tsUrls, dir) {
  for (let index = 0; index < DOWNLOAD_MISSION_COUNT; index++) {
    tsUrls[index] &&
      downloadMission({
        tsUrlsItem: tsUrls[index],
        tsUrls,
        dir,
      });
  }
}

async function downloadTs(tsUrls, path) {
  let dir = store.state.Prefrence.downloadPath + "/" + path;
  let mainWin = BrowserWindow.fromId(store.state.MainWindow.mainWindowId);

  mainWin.webContents.send("downloadBegin", path);

  makeDir(dir);
  download(tsUrls, dir);
}
