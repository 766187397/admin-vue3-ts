import { getRoutesByRole } from "@/api/modules/menu";
import { defineStore } from "pinia";
import { ref, type AsyncComponentLoader } from "vue";
import type { GetRoutesByRoleParams, RoleRoutes } from "@/types/menu";
import router from "@/router";
import { deepClone } from "@/utils/tool";
import type { RouteRecordRaw } from "vue-router";

// 定义 Store，使用函数，更适合Vue3，注意要使用ref并将需要的数据或函数返回出去
export const useMenuStore = defineStore("menu", () => {
  // 路由菜单
  let menu = ref<RoleRoutes[]>([]);
  /**获取路由菜单 */
  const getMenu = async () => {
    const routerList =
      router
        .getRoutes()
        .find((item) => item.name == "layout")
        ?.children.filter((item) => item.meta?.type == "menu") || [];
    menu.value = [...handleRouter(routerList), ...dynamicMenu.value];
  };

  const handleRouter = (arr: RouteRecordRaw[] | []): RoleRoutes[] => {
    return arr.map((item: any) => {
      if (item.children) {
        item.children = handleRouter(item.children);
      }
      return {
        path: item.path,
        name: item.name,
        redirect: item.redirect,
        meta: {
          ...item.meta,
        },
        children: item.children,
      };
    });
  };
  // 动态菜单路由
  let dynamicMenu = ref<RoleRoutes[]>([]);
  /**
   * 使用接口获取路由菜单
   * @param {GetRoutesByRoleParams} params - 请求参数
   */
  const getDynamicMenu = async (params: GetRoutesByRoleParams) => {
    const res = await getRoutesByRole(params);
    dynamicMenu.value = res.data;
  };
  // 全部动态路由
  let dynamicMenuAll = ref<RoleRoutes[]>([]);
  /**
   * 使用接口获取全部路由菜单
   */
  const getDynamicMenuAll = async () => {
    return new Promise(async (resolve) => {
      const res = await getRoutesByRole();
      dynamicMenuAll.value = res.data;
      addRouters(res.data);
      // 菜单扁平化
      menuFlatten.value = flattenMenu(deepClone(res.data));
      resolve(undefined);
      // console.log("router.getRoutes()", router.getRoutes());
    });
  };

  /**
   * 移除路由（通常是登出时使用传入所有的动态路由）
   * @param {RoleRoutes} routes 需要移除的路由
   */
  const removeRouters = (routes: RoleRoutes[]) => {
    routes.forEach((route) => {
      router.removeRoute(route.name as string);
      if (route.children) {
        removeRouters(route.children);
      }
    });
    menu.value = [];
    dynamicMenu.value = [];
    dynamicMenuAll.value = [];
  };

  // 全部路由扁平化
  let menuFlatten = ref<RoleRoutes[]>([]);

  // 扁平化菜单数据
  const flattenMenu = (items: any[], result: any[] = []) => {
    items.forEach((item) => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        flattenMenu(item.children, result);
        delete item.children;
      }
    });
    return result;
  };

  // 是否折叠
  let isCollapse = ref<boolean>(false);
  /**
   * 设置折叠状态
   * @param {boolean} val
   */
  const setIsCollapse = (val: boolean) => {
    isCollapse.value = val;
  };

  // 添加路由
  const modules = import.meta.glob("@/views/**/*.vue") as Record<string, AsyncComponentLoader>;
  const addRouters = (data: RoleRoutes[], fatherName: string = "layout") => {
    data.forEach((item) => {
      const componentPath = `/src/views/${item.component}.vue`;
      const routerConfig: RouteRecordRaw = {
        path: item.path,
        name: item.name,
        meta: item.meta,
        redirect: item.redirect || undefined,
        children: (item.children || []) as RouteRecordRaw[],
      };
      if (item.component) {
        routerConfig.component = defineAsyncComponent({
          loader: async () => await modules[componentPath](),
          // 可选项：设置延迟显示 fallback（默认200ms）
          delay: 200,
          // 可选项：加载失败重试等
          timeout: 30000,
        });
      }
      router.addRoute(fatherName, routerConfig);
      if (item.children && item.children.length > 0) {
        addRouters(item.children, item.name);
      }
    });
  };
  return {
    menu,
    getMenu,
    dynamicMenu,
    getDynamicMenu,
    dynamicMenuAll,
    getDynamicMenuAll,
    menuFlatten,
    isCollapse,
    setIsCollapse,
    removeRouters,
  };
});
