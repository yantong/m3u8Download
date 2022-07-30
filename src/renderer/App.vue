<template>
  <div id="app">
    <div class="title"></div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "m3u8",
};
</script>

<style scoped lang="less">
#app {
  height: 100%;
  display: flex;
  flex-direction: column;

  .title {
    height: 28px;
    -webkit-app-region: drag;
  }

  .content {
    height: 0;
    flex-grow: 1;
  }
}
</style>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  height: 100vh;
  font-family: "Source Sans Pro", sans-serif;
}
</style>
