import { createApp } from "vue";
// import "ant-design-vue/dist/antd.dark.less";
import "./styles/global.css";
import "./styles/tailwind.css";
import "./styles/reset.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import MIcon from "./components/MIcon/MIcon.vue";
import CommonHeader from "./components/CommonHeader/CommonHeader.vue";
import router from "./router";
import Antd from "ant-design-vue";
import { Api } from "@music/common";
import { useAppStore } from "./stores";
import "./utils/indexed-db";
import { appIndexedDB } from "./utils/indexed-db";

Api.initHttp({
  baseURL: "http://localhost:8083/api",
  // baseURL: "https://music.vanyi.top/api",
});

Api.http.axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

Api.http.axios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const app = createApp(App);
const pinia = createPinia();

// TODO 注册组件
// app.component("MIcon", MIcon);
// app.component("CommonHeader", CommonHeader);
app.use(pinia);
app.use(router);
app.use(Antd);
app.mount("#app");

(() => {
  const appStore = useAppStore();
  router.afterEach(() => {
    appStore.historyState = window.history.state;
  });
})();

appIndexedDB.openDB("AppCacheDB", 1);
