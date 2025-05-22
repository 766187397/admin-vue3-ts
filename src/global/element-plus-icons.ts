// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import type { App } from "vue";

/**
 * 始化Element Plus Icons Vue  图标
 * @param {App<Element>} app  vue实例
 */
export default function registerElementPlusIcons(app: App<Element>) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
}
