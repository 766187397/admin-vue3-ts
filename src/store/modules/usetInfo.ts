import { defineStore } from "pinia";
import { ref } from "vue";
import { encrypt, decrypt } from "@/utils/crypto";
import type { LoginForm } from "@/types/login";

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
    let loginForm = ref<LoginForm | null>();
    /**  设置登录表单信息 */
    const setLoginForm = (val: any) => {
      loginForm.value = val;
    };

    return {
      token_type,
      token,
      refresh_token,
      userInfo,
      rememberMe,
      loginForm,
      setTokenType,
      setToken,
      setRfreshToken,
      setUserInfo,
      setRememberMe,
      setLoginForm,
    };
  },
  {
    persist: [
      {
        storage: {
          getItem(key) {
            const value = localStorage.getItem(key);
            if (value) {
              if (key === "loginForm") {
                return JSON.parse(decrypt(value));
              }
              return JSON.parse(value);
            }
            return "";
          },
          setItem(key, value) {
            if (key === "loginForm") {
              return localStorage.setItem(key, encrypt(JSON.stringify(value)));
            }

            return localStorage.setItem(key, JSON.stringify(value));
          },
        },
      },
    ],
  }
);
