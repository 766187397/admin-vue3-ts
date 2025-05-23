import { defineStore } from "pinia";
import { ref } from "vue";

// 定义 Store，使用函数，更适合Vue3，注意要使用ref并将需要的数据或函数返回出去
export const useTestStore = defineStore(
  "test",
  () => {
    const testText = ref<string>("");

    // 保存会员信息，登录时使用
    const setTestText = (val: string) => {
      testText.value = val;
    };

    // 清理会员信息，退出时使用
    const clearsetTestText = () => {
      testText.value = "";
    };

    // 记得 return
    return {
      testText,
      setTestText,
      clearsetTestText,
    };
  },
  {
    persist: true,
  }
);
