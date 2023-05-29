import { createApp } from "vue";
import "./styles/antd-reset.less";
import "./styles/global.css";
import "./styles/tailwind.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import MIcon from "./components/MIcon/MIcon.vue";
import CommonHeader from "./components/CommonHeader/CommonHeader.vue";
import router from "./router";
import Antd from "ant-design-vue";

const app = createApp(App);
const pinia = createPinia();

app.component("MIcon", MIcon);
app.component("CommonHeader", CommonHeader);
app.use(pinia);
app.use(router);
app.use(Antd);
app.mount("#app");
