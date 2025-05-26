import type { RouteRecordRaw } from "vue-router";

import Error from "@/views/error/Index.vue";
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
      // {
      //   path: "/home",
      //   name: "home",
      //   component: () => import("@/views/home/Index.vue"),
      //   meta: {
      //     title: "首页",
      //   },
      // },
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
    path: "/error/:errorCode/:errorMessage",
    name: "error",
    component: Error,
    props: true,
    meta: {
      title: "服务器网络异常",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: Error,
    meta: {
      title: "404 Not Found",
    },
  },
];

export default routes;
