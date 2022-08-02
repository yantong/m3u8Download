<template>
  <div id="wrapper">
    <div class="search">
      <el-input
        class="search-input"
        v-model="url"
        size="medium"
        @input="setDownloadUrl"
        @keyup.native.enter="openDownloadPage"
      ></el-input>
    </div>
    <tab></tab>
  </div>
</template>

<script>
import Tab from "./components/Tab.vue";
import { ipcRenderer } from "electron";
import { mapState, mapActions } from "vuex";

export default {
  name: "main-page",
  components: { Tab },
  data() {
    return {
      url: "https://v5.szjal.cn/20210614/09CazJvM/index.m3u8",
    };
  },
  created() {
    this.getDownloadPath();
    this.setDownloadUrl(this.url);
  },
  computed: {
    ...mapState({
      downloadPath: (state) => state.Prefrence.downloadPath,
      downloadUrl: (state) => state.GlobalData.downloadUrl,
    }),
  },
  methods: {
    ...mapActions({
      setDownloadPath: "setDownloadPath",
      setDownloadUrl: "setDownloadUrl",
    }),

    getDownloadPath() {
      ipcRenderer.on("getPath", (event, path) => {
        this.setDownloadPath(path);
      });
      ipcRenderer.on("downloadReady", () => {
        this.setDownloadUrl((this.url = ""));
      });

      if (!this.downloadPath) {
        ipcRenderer.send("getPath", "downloads");
      }
    },
    openDownloadPage() {
      this.downloadUrl && ipcRenderer.send("openDownloadPage");
    },
  },
};
</script>

<style scoped lang="less">
#wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  .search {
    .search-input {
      display: block;
      width: 50%;
      margin: 0 auto;

      /deep/ input {
        border-radius: 16px;
      }
    }
  }
}
</style>
