<template>
  <div class="tabs">
    <div class="tab-items">
      <span
        class="tab-item"
        :class="{
          seled: selTab == item.value,
        }"
        v-for="(item, index) in tabItems"
        :key="index"
        @click="selTab = item.value"
        >{{ item.name }}</span
      >
    </div>
    <el-divider class="divider"></el-divider>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabItems: [
        {
          name: "正在下载",
          value: "downloading",
        },
        {
          name: "已完成",
          value: "downloaded",
        },
      ],
      selTab: "downloading",
    };
  },
};
</script>

<style scoped lang="less">
.tabs {
  margin: 10px;

  .tab-items {
    font-weight: bold;
    font-size: 18px;

    .tab-item {
      margin-right: 60px;
      color: #c0c4cc;
      cursor: pointer;

      &.seled {
        color: #000;
      }
    }
  }

  .divider {
    margin: 10px 0;
  }
}
</style>
