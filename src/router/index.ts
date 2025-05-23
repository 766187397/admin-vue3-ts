import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useUserInfoStore, useMenuStore } from "@/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 定义白名单数组
// 前缀匹配白名单：以这些路径开头的路由不需要登录验证
const prefixWhitelist: string[] = [];
// 全匹配白名单：这些路由完全匹配时不需要登录验证
const fullMatchWhitelist: string[] = ["/login", "/403", "/404"];

// 全局前置守卫，处理页面标题和登录验证
router.beforeEach(async (to, from, next) => {
  if (to.meta?.externalLinks) {
    return next({ path: from.path });
  }

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 管理系统` : "管理系统";

  // 检查路由是否在白名单中
  const isInFullMatchWhitelist = fullMatchWhitelist.includes(to.path);
  const isInPrefixWhitelist = prefixWhitelist.some((prefix) => to.path.startsWith(prefix));

  // 如果路由在白名单中，不需要认证，则直接放行
  if (isInFullMatchWhitelist || isInPrefixWhitelist) {
    return next();
  }

  const userInfoStore = useUserInfoStore();
  const menuStore = useMenuStore();
  // 检查用户是否已登录
  const token = userInfoStore.token;
  if (token) {
    // 已登录
    if (!menuStore.menuAll || menuStore.menuAll.length === 0) {
      await menuStore.getMenu({ type: "menu" });
      await menuStore.getMenuAll();
    }
    next();
  } else {
    // 未登录，重定向到登录页面，并保存原目标路由用于登录后跳转
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
});

export default router;
