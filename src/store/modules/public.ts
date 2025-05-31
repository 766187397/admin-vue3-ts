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




  return {
    fullScreen,
    getFullScreenState,
    enterFullScreen,
    exitFullscreen,
  };
});
