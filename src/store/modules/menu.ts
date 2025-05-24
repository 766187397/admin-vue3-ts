import { getRoutes } from "@/api/menu";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { getRoutesParams, RoleRoutes } from "@/types/menu";
import router from "@/router";
import { deepClone } from "@/utils/tool";

// 定义 Store，使用函数，更适合Vue3，注意要使用ref并将需要的数据或函数返回出去
export const useMenuStore = defineStore("menu", () => {
  // 菜单路由
  let menu = ref<RoleRoutes[]>([]);
  /**
   * 使用接口获取路由菜单
   * @param {getRoutesParams} params - 请求参数
   */
  const getMenu = async (params: getRoutesParams) => {
    const res = await getRoutes(params);
    menu.value = res.data;
  };
  // 全部路由
  let menuAll = ref<RoleRoutes[]>([]);
  /**
   * 使用接口获取全部路由菜单
   */
  const getMenuAll = async () => {
    const res = await getRoutes();
    menuAll.value = res.data;

    // 菜单扁平化
    menuFlatten.value = flattenMenu(deepClone(res.data));
    addRouters(res.data);
    console.log("router.getRoutes()", router.getRoutes());
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
  const modules = import.meta.glob("@/views/**/*.vue");
  const addRouters = (data: RoleRoutes[], fatherName: string = "layout") => {
    data.forEach((item) => {
      const componentPath = `/src/views/${item.component}.vue`;
      router.addRoute(fatherName, {
        path: item.path,
        name: item.name,
        component: modules[componentPath],
        meta: item.meta,
      });
      if (item.children && item.children.length > 0) {
        addRouters(item.children, item.name);
      }
    });
  };
  return {
    menu,
    getMenu,
    menuAll,
    getMenuAll,
    menuFlatten,
    isCollapse,
    setIsCollapse,
  };
});
