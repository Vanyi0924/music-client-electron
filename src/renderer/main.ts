import { createApp } from "vue";
import "ant-design-vue/dist/reset.css";
import "./styles/tailwind.css";
import "./styles/reset.css";
import "./styles/global.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import Antd from "ant-design-vue";
import { useAppStore } from "./stores";
import "./utils/indexed-db";
import { appIndexedDB } from "./utils/indexed-db";
import { configApi } from "./http/init";
import { getExistFavorite, isLogin } from "./http/api";
import { useAccountStore } from "./stores/account";

const app = createApp(App);
const pinia = createPinia();

// TODO 注册组件
// app.component("MIcon", MIcon);
// app.component("CommonHeader", CommonHeader);
app.use(pinia);
app.use(router);
app.use(Antd);
app.mount("#app");

(async () => {
  const appStore = useAppStore();
  router.afterEach(() => {
    appStore.historyState = window.history.state;
  });

  configApi();

  const { data: hasLogged } = await isLogin();
  const accountStore = useAccountStore();

  if (hasLogged) {
    getExistFavorite().then(({ data }) => {
      const map = new Map<string, { id: string; songId: string }>();
      (data || []).forEach((d) => {
        // 已收藏的歌曲 map
        map.set(String(d.songId), {
          id: String(d.id),
          songId: String(d.songId),
        });

        // 设置播放列表
        const playlistSong = appStore.playlist.find(
          (songDetail) => songDetail.id === String(d.id)
        );

        playlistSong && (playlistSong._hasFavorite = true);
      });

      appStore.setPlaylist(appStore.playlist);
      appStore.favoriteSongs = map;
    });
    // favoriteSongs
    // ...
  } else {
    appStore.removePlaylist();
    accountStore.removeUser();
  }
})();

appIndexedDB.openDB("AppCacheDB", 1);
