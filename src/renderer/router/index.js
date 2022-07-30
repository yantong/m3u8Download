import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "main-page",
      component: require("@/views/main/").default,
    },
    {
      path: "/prefrence",
      name: "prefrence-page",
      component: require("@/views/prefrence/").default,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
