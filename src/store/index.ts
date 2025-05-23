import { createPinia } from "pinia";
// https://prazdevs.github.io/pinia-plugin-persistedstate/zh/
import persist from "pinia-plugin-persistedstate";

// 创建 pinia 实例
const pinia = createPinia();
// 使用持久化存储插件
pinia.use(persist);

// 默认导出，给 main.ts 使用
export default pinia;

// 统一导出
export * from "./modules/test";
export * from "./modules/usetInfo";
export * from "./modules/menu";
