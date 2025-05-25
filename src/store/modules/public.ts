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
        // console.log("进入全屏成功");
        fullScreen.value = true;
      })
      .catch((error) => {
        fullScreen.value = false;
        // 不能进入全屏的可能原因
        // if (error.name === "NotAllowedError") {
        //   console.log("必须由用户触发才能进入全屏（例如点击等行为）");
        // } else if (error.name === "NotSupportedError") {
        //   console.log("在当前环境中不支持全屏");
        // } else {
        //   console.log("发生错误", error);
        // }
      });
  };
  /** 退出 */
  const exitFullscreen = () => {
    document
      .exitFullscreen()
      .then(() => {
        // console.log("退出全屏成功");
        fullScreen.value = false;
      })
      .catch((error) => {
        fullScreen.value = true;
        // console.log("退出全屏失败", error);
      });
  };
  return {
    fullScreen,
    getFullScreenState,
    enterFullScreen,
    exitFullscreen,
  };
});
