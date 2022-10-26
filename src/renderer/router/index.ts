import {
  createRouter,
  createWebHashHistory,
} from "vue-router";

import PageOne from "@/pages/PageOne.vue";

export default () => {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: "/", component: PageOne },
      {
        path: "/page-two",
        component: () => import("@/pages/PageTwo.vue"),
      },
    ],
  });

  // 全局导航守卫
  router.beforeEach((to, from) => {
    return true
  });
  return router;
};
