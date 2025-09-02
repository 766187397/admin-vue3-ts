import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useMenuStore } from "@/store";
import initData from "./initData";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 定义白名单数组
// 前缀匹配白名单：以这些路径开头的路由不需要登录验证
const prefixWhitelist: string[] = ["/error"];
// 全匹配白名单：这些路由完全匹配时不需要登录验证
const fullMatchWhitelist: string[] = ["/login"];

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

  const menuStore = useMenuStore();
  // 检查用户是否已登录
  const token = localStorage.getItem("token");
  // 错误页面无需任何请求直接方向
  if (to.path.startsWith("/error")) {
    next();
  } else if (token) {
    // 获取初始的数据
    initData();
    // 已登录
    if (!menuStore.dynamicMenuAll || menuStore.dynamicMenuAll.length === 0) {
      await menuStore.getDynamicMenu({ type: "menu" });
      await menuStore.getDynamicMenuAll();
      // 请求后没有路由，则返回到错误页面
      if (menuStore.dynamicMenuAll.length === 0) {
        next({
          name: "error",
          params: {
            errorCode: 403,
            errorMessage: "未配置路由，请联系管理员。",
          },
        });
      }
      next({ path: to.path, replace: true });
      menuStore.getMenu();
    } else {
      next();
    }
  } else {
    // 如果路由在白名单中，不需要认证，则直接放行
    if (isInFullMatchWhitelist || isInPrefixWhitelist) {
      next();
    }
    // 未登录，不在白名单中，则重定向到登录页面，并保存原目标路由用于登录后跳转
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
});

export default router;
