import { defineStore } from "pinia";

/** 全局的配置 */
export const useElConfigStore = defineStore(
  "ElConfig",
  () => {
    /** 默认值 */
    const defaultConfig = {
      size: "small",
      themeColor: "#409eff",
    };

    /** 组件全局配置 */
    const config = ref({
      ...defaultConfig,
    });

    /** 设置组件全局配置 */
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

    /** hex颜色转rgb颜色 */
    const hexToRgb = (str: any) => {
      let hexs: any = "";
      const reg = /^\#?[0-9A-Fa-f]{6}$/;
      if (!reg.test(str)) return "";
      str = str.replace("#", "");
      hexs = str.match(/../g);
      for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16);
      return hexs;
    };

    /** rgb颜色转Hex颜色 */
    const rgbToHex = (r: any, g: any, b: any) => {
      const reg = /^\d{1,3}$/;
      if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return "";
      const hexs = [r.toString(16), g.toString(16), b.toString(16)];
      for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = `0${hexs[i]}`;
      return `#${hexs.join("")}`;
    };

    /** 浅色 */
    const getLightColor = (color: string, level: number) => {
      const reg = /^\#?[0-9A-Fa-f]{6}$/;
      if (!reg.test(color)) return "";
      const rgb = hexToRgb(color);
      for (let i = 0; i < 3; i++) rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));
      return rgbToHex(rgb[0], rgb[1], rgb[2]);
    };

    /** 深色 */
    const getDarkColor = (color: string, level: number) => {
      let rgb = hexToRgb(color);
      for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor(rgb[i] * (1 - level));
      }
      return rgbToHex(rgb[0], rgb[1], rgb[2]);
    };

    /** 修改主题颜色 */
    const changeThemeColor = (val: string) => {
      // 计算主题颜色变化
      document.documentElement.style.setProperty("--el-color-primary", val);
      for (let i = 1; i < 10; i++) {
        document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor(val, i / 10)}`);
        document.documentElement.style.setProperty(`--el-color-dark-light-${i}`, `${getDarkColor(val, i / 10)}`);
      }
      config.value.themeColor = val;
    };

    return {
      config,
      setConfig,
      restoreDefault,
      changeThemeColor,
    };
  },
  {
    persist: true,
  }
);
