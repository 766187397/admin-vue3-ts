import type { RouteRecordRaw } from "vue-router";

import test from "@/views/test.vue";
import Login from "@/views/Login.vue";
import NotFound from "@/views/error/404.vue";
import NoPermission from "@/views/error/403.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "登录",
      requiresAuth: false,
    },
  },
  {
    path: "/test",
    name: "test",
    component: test,
  },
  {
    path: "/403",
    name: "noPermission",
    component: NoPermission,
    meta: {
      title: "无权限",
      requiresAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: NotFound,
    meta: {
      title: "404 Not Found",
      requiresAuth: false,
    },
  },
];

export default routes;
