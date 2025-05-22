import router from "./index";

// 定义白名单数组
// 前缀匹配白名单：以这些路径开头的路由不需要登录验证
const prefixWhitelist: string[] = ["/api", "/public"];
// 全匹配白名单：这些路由完全匹配时不需要登录验证
const fullMatchWhitelist: string[] = ["/login", "/register", "/forget-password"];

// 全局前置守卫，处理页面标题和登录验证
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 管理系统` : "管理系统";

  // 检查路由是否在白名单中
  const isInFullMatchWhitelist = fullMatchWhitelist.includes(to.path);
  const isInPrefixWhitelist = prefixWhitelist.some((prefix) => to.path.startsWith(prefix));

  // 如果路由在白名单中，或者路由的meta信息明确标记不需要认证，则直接放行
  if (isInFullMatchWhitelist || isInPrefixWhitelist || to.meta.requiresAuth === false) {
    return next();
  }

  // 检查用户是否已登录（这里假设使用localStorage存储token）
  const token = localStorage.getItem("token");
  if (token) {
    // 已登录，放行
    next();
  } else {
    // 未登录，重定向到登录页面，并保存原目标路由用于登录后跳转
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
});
