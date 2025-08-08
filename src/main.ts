import "normalize.css";
import "@/assets/styles/base.css";
import "@/assets/styles/base.scss";
import { createApp } from "vue";
const app = createApp(App);

import pinia from "@/store/index";

import zhCn from "element-plus/es/locale/lang/zh-cn";
import ElementPlus from "element-plus";

import App from "./App.vue";
import router from "./router";

import registerElementPlusIcons from "./global/element-plus-icons";
registerElementPlusIcons(app);

import ECharts from "vue-echarts";
import { use } from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

use([BarChart, LineChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);

app.component("v-chart", ECharts);

app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});

app.mount("#app");
