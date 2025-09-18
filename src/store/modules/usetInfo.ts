import { defineStore } from "pinia";
import { ref } from "vue";
import { encrypt, decrypt } from "@/utils/crypto";
import type { LoginForm } from "@/types/login";
import { logout } from "@/api/modules/login";
import router from "@/router";

import { useElConfigStore } from "./elConfig";
import { useMenuStore } from "./menu";

// 定义 Store，使用函数，更适合Vue3，注意要使用ref并将需要的数据或函数返回出去
export const useUserInfoStore = defineStore(
  "userInfo",
  () => {
    /** 用户信息 */
    let userInfo = ref<any>({});

    /** 设置用户信息 */
    const setUserInfo = (val: any) => {
      userInfo.value = val;
    };

    /** 记住我 */
    let rememberMe = ref<boolean>(false);

    /** 设置记住我 */
    const setRememberMe = (val: boolean) => {
      rememberMe.value = val;
    };

    /** 登录表单信息 */
    let loginForm = ref<string>("");
    /**  设置登录表单信息 */
    const setLoginForm = (val: LoginForm) => {
      loginForm.value = encrypt(JSON.stringify(val));
    };

    const getLoginForm = (): LoginForm => JSON.parse(decrypt(loginForm.value));

    /** 处理退出登录 */
    const handleLogout = async () => {
      let res = await logout();
      if (res.code === 200) {
        const elConfigStore = useElConfigStore();
        const menuStore = useMenuStore();
        const { restoreDefault, changeThemeColor } = elConfigStore;
        const { removeRouters, dynamicMenu } = menuStore;
        // 清除token
        localStorage.removeItem("token_type");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        // 清除用户信息
        setUserInfo({});
        // 恢复默认配置
        restoreDefault();
        // 恢复默认颜色
        changeThemeColor(elConfigStore.defaultConfig.themeColor);
        // 移除动态路由
        removeRouters(dynamicMenu);
        router.push("/login");
      }
    };
    return {
      userInfo,
      setUserInfo,
      rememberMe,
      setRememberMe,
      loginForm,
      setLoginForm,
      getLoginForm,
      handleLogout,
    };
  },
  {
    persist: true,
  }
);
