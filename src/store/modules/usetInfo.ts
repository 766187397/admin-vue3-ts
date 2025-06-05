import { defineStore } from "pinia";
import { ref } from "vue";
import { encrypt, decrypt } from "@/utils/crypto";
import type { LoginForm } from "@/types/login";
import { logout } from "@/api/login";
import router from "@/router";

import { useElConfigStore } from "./elConfig";

// 定义 Store，使用函数，更适合Vue3，注意要使用ref并将需要的数据或函数返回出去
export const useUserInfoStore = defineStore(
  "userInfo",
  () => {
    /** token前缀 */
    let token_type = ref<string>("Bearer ");
    /** 设置token前缀 */
    const setTokenType = (val: string) => {
      token_type.value = val;
    };

    /** token */
    let token = ref<string>("");

    /** 设置token */
    const setToken = (val: string) => {
      token.value = val;
    };

    /** 刷新token */
    let refresh_token = ref<string>("");

    /** 设置刷新token */
    const setRfreshToken = (val: string) => {
      refresh_token.value = val;
    };

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
        const { restoreDefault, changeThemeColor } = elConfigStore;
        // 清除token
        setToken("");
        setRfreshToken("");
        // 清除用户信息
        setUserInfo({});
        // 恢复默认配置
        restoreDefault();
        // 恢复默认颜色
        changeThemeColor(elConfigStore.defaultConfig.themeColor);
        router.push("/login");
      }
    };
    return {
      token_type,
      setTokenType,
      token,
      setToken,
      refresh_token,
      setRfreshToken,
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
