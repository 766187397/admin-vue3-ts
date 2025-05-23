import type { RouteRecordRaw } from "vue-router";

import NotFound from "@/views/error/404.vue";
import NoPermission from "@/views/error/403.vue";
import Layout from "@/layout/Index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "layout",
    component: Layout,
    meta: {
      title: "layout",
      requiresAuth: true,
    },
    redirect: "/test",
    children: [
      {
        path: "test",
        name: "test",
        component: () => import("@/views/test.vue"),
        meta: {
          title: "test",
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login/Index.vue"),
    meta: {
      title: "登录",
      requiresAuth: false,
    },
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
