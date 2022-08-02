<template>
  <div>
    <download-item
      v-for="item in downloadItems"
      :key="item.name"
      v-bind="item"
    ></download-item>
  </div>
</template>

<script>
import DownloadItem from "./DownloadItem.vue";
import { ipcRenderer } from "electron";

export default {
  components: {
    DownloadItem,
  },
  data() {
    return {
      downloadItems: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    ipcRenderer.on("downloadBegin", (event, name) => {
      this.downloadItems.push({
        name,
        process: 0,
      });
    });

    ipcRenderer.on("downloadProcess", (event, { name, process }) => {
      let index = this.downloadItems.findIndex((item) => item.name == name);

      this.downloadItems.splice(index, 1, {
        name,
        process,
      });
    });

    ipcRenderer.on("downloadEnd", (event, name) => {
      let index = this.downloadItems.findIndex((item) => item.name == name);

      this.downloadItems.splice(index, 1);
    });
  },
  methods: {},
};
</script>

<style scoped lang=""></style>
