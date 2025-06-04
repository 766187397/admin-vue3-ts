import "normalize.css";
import "@/assets/styles/base.css";
import "@/assets/styles/base.scss";

import { createApp } from "vue";
import pinia from "@/store/index";

import zhCn from "element-plus/es/locale/lang/zh-cn";
import ElementPlus from "element-plus";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
import registerElementPlusIcons from "./global/element-plus-icons";
registerElementPlusIcons(app);

app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});

app.mount("#app");
