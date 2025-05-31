import { defineStore } from "pinia";
import { ref } from "vue";

/** 公共 */
export const usePublicStore = defineStore("public", () => {
  // 全屏状态
  let fullScreen = ref<boolean>();

  /** 获取是否是全屏状态 */
  const getFullScreenState = () => {
    if (document.fullscreenElement) {
      fullScreen.value = true;
    } else {
      fullScreen.value = false;
    }
  };

  /** 进入 */
  const enterFullScreen = () => {
    document
      .querySelector("html")
      ?.requestFullscreen()
      .then(() => {
        fullScreen.value = true;
      })
      .catch((error) => {
        fullScreen.value = false;
      });
  };
  /** 退出 */
  const exitFullscreen = () => {
    document
      .exitFullscreen()
      .then(() => {
        fullScreen.value = false;
      })
      .catch((error) => {
        fullScreen.value = true;
      });
  };

  /** 平台类型列表 */
  const platformList = ref();

  /** 设置平台类型列表 */
  const setPlatformList = (list: any) => {
    platformList.value = list;
  };

  /** 公共状态 */
  const publicStateList = ref();

  /** 设置公共状态 */
  const setPublicStateList = (state: any) => {
    publicStateList.value = state;
  };

  return {
    fullScreen,
    getFullScreenState,
    enterFullScreen,
    exitFullscreen,
    platformList,
    setPlatformList,
    publicStateList,
    setPublicStateList,
  };
});
