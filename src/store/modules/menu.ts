import { getRoutes } from "@/api/menu";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { getRoutesParams, RoleRoutes } from "@/types/menu";

// 定义 Store，使用函数，更适合Vue3，注意要使用ref并将需要的数据或函数返回出去
export const useMenuStore = defineStore("menu", () => {
  let menu = ref<any>([]);
  let menuAll = ref<any>([]);
  let menuFlatten = ref<any>([]);

  const getMenu = async (params: getRoutesParams) => {
    const res = await getRoutes(params);
    menu.value = res.data;
  };
  const getMenuAll = async () => {
    const res = await getRoutes();
    menuAll.value = res.data;

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

    menuFlatten.value = flattenMenu(res.data as RoleRoutes[]);
  };
  return {
    menu,
    menuAll,
    menuFlatten,
    getMenu,
    getMenuAll,
  };
});
