import type { GetDictionaryItemAllResult } from "@/types/dictionary";
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
    document.querySelector("html")?.requestFullscreen();
  };
  /** 退出 */
  const exitFullscreen = () => {
    document.exitFullscreen();
  };

  /** 平台类型列表 */
  const platformList = ref<GetDictionaryItemAllResult[]>();

  /** 设置平台类型列表 */
  const setPlatformList = (list: GetDictionaryItemAllResult[]) => {
    platformList.value = list;
  };

  /** 公共状态 */
  const publicStateList = ref<GetDictionaryItemAllResult[]>();

  /** 设置公共状态 */
  const setPublicStateList = (state: GetDictionaryItemAllResult[]) => {
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
