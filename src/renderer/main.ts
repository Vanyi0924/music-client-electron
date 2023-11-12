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
import { isLogin } from "./http/api";
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
    // ...
  } else {
    accountStore.removeUser();
  }
})();

appIndexedDB.openDB("AppCacheDB", 1);
