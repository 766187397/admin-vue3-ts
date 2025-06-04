import { defineStore } from "pinia";

/** 全局的配置 */
export const useElConfigStore = defineStore(
  "locale",
  () => {
    const config = ref({
      size: "small",
    });

    return {
      config,
    };
  },
  {
    persist: true,
  }
);
