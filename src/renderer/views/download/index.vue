<template>
  <div class="form">
    <el-form label-width="80px" :model="form">
      <el-form-item label="下载路径">
        <el-input :value="downloadPath" size="medium" disabled>
          <el-button
            slot="append"
            icon="el-icon-more"
            @click="selDownloadPath"
          ></el-button
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="cancel">取消</el-button>
        <el-button size="medium" type="primary" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ipcRenderer } from "electron";

export default {
  components: {},
  props: {},
  data() {
    return {
      form: {},
    };
  },
  computed: {
    ...mapState({
      downloadPath: (state) => state.Prefrence.downloadPath,
      downloadUrl: (state) => state.GlobalData.downloadUrl,
    }),
  },
  watch: {},
  methods: {
    selDownloadPath() {
      ipcRenderer.send("selDownloadPath");
    },
    cancel() {
      ipcRenderer.send("closeDownloadPage");
    },
    submit() {
      ipcRenderer.send("closeDownloadPage");
      ipcRenderer.send("download", this.downloadUrl);
    },
  },
};
</script>

<style scoped lang="less">
.form {
  margin: 16px;
}
</style>
