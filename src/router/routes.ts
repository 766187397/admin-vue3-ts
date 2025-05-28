import type { RouteRecordRaw } from "vue-router";

import Error from "@/views/error/Index.vue";
import Layout from "@/layout/Index.vue";

/**
 * 路由配置meta说明
 * @param {string} title 路由标题，用于浏览器标题显示
 * @param {string} icon 路由图标，用于菜单栏显示
 * @param {boolean} externalLinks 是否为外部链接
 * @param {number} status 状态根据业务自定义
 * @param {string} type 类型，用于菜单栏显示
 */

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
        name: "test",
        path: "/test",
        component: () => import("@/views/Test.vue"),
        meta: {
          type: "menu",
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
