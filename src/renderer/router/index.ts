import { createWebHashHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {
      top: 0,
    };
  },
  routes: [
    {
      path: "/",
      // redirect: "/songlist",
      component: () => import("@/pages/Main/Main.vue"),
      children: [
        {
          path: "songlist",
          component: () => import("@/pages/Songlist/Songlist.vue"),
        },
        {
          path: "songlist/detail",
          component: () => import("@/pages/Songlist/SonglistDetail.vue"),
        },
        {
          path: "playDetail",
          component: () => import("@/pages/PlayDetail/PlayDetail.vue"),
        },
      ],
    },
  ],
});

export default router;
