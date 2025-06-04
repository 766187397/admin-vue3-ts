import type { getDictionaryItemAllResult } from "@/types/public";
import { defineStore } from "pinia";
import { ref } from "vue";

/** 公共 */
export const usePublicStore = defineStore("public", () => {
  // 全屏状态
  let fullScreen = ref<boolean>();

  /** 获取并设置全屏状态 */
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

  const theme = ref<boolean>(false);

  /** 切换主题动画 */
  const handleAnimation = (e: MouseEvent) => {
    // 执行切换主题的操作
    const transition = document.startViewTransition(() => {
      // 动画过渡切换主题色
      document.documentElement.classList.toggle("dark");
    });

    // document.startViewTransition 的 ready 返回一个 Promise
    transition.ready.then(() => {
      // 获取鼠标的坐标
      const { clientX, clientY } = e;

      // 计算最大半径
      const radius = Math.hypot(Math.max(clientX, innerWidth - clientX), Math.max(clientY, innerHeight - clientY));

      // 圆形动画扩散开始
      const animation = document.documentElement.animate(
        {
          clipPath: [`circle(0% at ${clientX}px ${clientY}px)`, `circle(${radius}px at ${clientX}px ${clientY}px)`],
        },
        // 设置时间，已经目标伪元素
        {
          duration: 500,
          pseudoElement: "::view-transition-new(root)",
        }
      );

      animation.onfinish = () => {
        theme.value = !theme.value;
      };
    });
  };

  /** 平台类型列表 */
  const platformList = ref<getDictionaryItemAllResult[]>();

  /** 设置平台类型列表 */
  const setPlatformList = (list: getDictionaryItemAllResult[]) => {
    platformList.value = list;
  };

  /** 公共状态 */
  const publicStateList = ref<getDictionaryItemAllResult[]>();

  /** 设置公共状态 */
  const setPublicStateList = (state: getDictionaryItemAllResult[]) => {
    publicStateList.value = state;
  };

  return {
    fullScreen,
    getFullScreenState,
    enterFullScreen,
    exitFullscreen,
    theme,
    handleAnimation,
    platformList,
    setPlatformList,
    publicStateList,
    setPublicStateList,
  };
});
