import { defineStore } from "pinia";

/** 全局的配置 */
export const useElConfigStore = defineStore(
  "ElConfig",
  () => {
    /** 默认值 */
    const defaultConfig = {
      size: "small",
    };

    /** 组件全局配置 */
    const config = ref({
      ...defaultConfig,
    });

    const setConfig = (newConfig: any) => {
      config.value = {
        ...config.value,
        ...newConfig,
      };
    };

    /** 恢复默认值 */
    const restoreDefault = () => {
      config.value = defaultConfig;
    };

    return {
      config,
      setConfig,
      restoreDefault,
    };
  },
  {
    persist: true,
  }
);
