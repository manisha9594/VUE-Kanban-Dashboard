import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    meta: {
      title: "Kanban list",
    },
  },
  {
    path: "/kanban/:id/:name",
    name: "Kanban",
    component: () => import("../views/KanbanView.vue"),
    meta: {
      title: "Kanban",
    },
  },
  {
    path: "/doesnotexist",
    name: "doesnotexist",
    component: () => import("../components/PageNotFound"),
    meta: {
      title: "PagenotFound",
    },
  },
  { path: "*", redirect: "/doesnotexist", hidden: true },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  next();
});
