<template>
  <div id="wrapper">
    <div class="search">
      <el-input class="search-input" v-model="input" size="medium"></el-input>
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
      input: "",
    };
  },
  created() {
    this.getDownloadPath();
  },
  computed: {
    ...mapState({
      downloadPath: (state) => state.Prefrence.downloadPath,
    }),
  },
  methods: {
    ...mapActions({
      setDownloadPath: "setDownloadPath",
    }),

    getDownloadPath() {
      ipcRenderer.on("getPath", (event, path) => {
        this.setDownloadPath(path);
      });

      if (!this.downloadPath) {
        ipcRenderer.send("getPath", "downloads");
      }
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
