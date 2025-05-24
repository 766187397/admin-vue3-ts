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
    },
    redirect: "/home",
    children: [
      {
        path: "/test",
        name: "test",
        component: () => import("@/views/Test.vue"),
        meta: {
          title: "测试",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/Index.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/403",
    name: "noPermission",
    component: NoPermission,
    meta: {
      title: "无权限",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: NotFound,
    meta: {
      title: "404 Not Found",
    },
  },
];

export default routes;
