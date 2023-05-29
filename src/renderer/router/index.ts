import { createWebHashHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/songlist",
      component: () => import("@/pages/Main/Main.vue"),
      children: [
        {
          path: "songlist",
          component: () => import("@/pages/SongList/SongList.vue"),
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
