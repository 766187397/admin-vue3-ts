import { getRoutes } from "@/api/menu";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { getRoutesParams } from "@/types/menu";

// 定义 Store，使用函数，更适合Vue3，注意要使用ref并将需要的数据或函数返回出去
export const useMenuStore = defineStore("menu", () => {
  let menu = ref([]);
  let menuAll = ref([]);

  const getMenu = async (params: getRoutesParams) => {
    const res = await getRoutes(params);
    menu.value = res.data;
  };
  const getMenuAll = async () => {
    const res = await getRoutes();
    menuAll.value = res.data;
  };
  return {
    menu,
    menuAll,
    getMenu,
    getMenuAll,
  };
});
