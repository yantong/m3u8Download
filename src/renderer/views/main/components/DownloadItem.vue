<template>
  <div class="download-item">
    <div class="name">{{name}}</div>
    <el-progress :percentage="process"></el-progress>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    name: {},
    process: {},
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang=""></style>
