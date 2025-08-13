<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0" class="login-form">
    <el-form-item prop="account">
      <el-input
        class="custom-input"
        v-model="loginForm.account"
        placeholder="请输入账号"
        :prefix-icon="User"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        class="custom-input"
        v-model="loginForm.password"
        type="password"
        placeholder="请输入密码"
        :prefix-icon="Lock"
        show-password
        @keyup.enter="handleLogin"
      />
    </el-form-item>
    <el-form-item prop="code">
      <div class="row">
        <el-input
          class="custom-input"
          v-model="loginForm.code"
          :prefix-icon="ChatSquare"
          @keyup.enter="handleLogin"
        />
        <img :src="codeUrl" alt="验证码" @click="handleeGetCode" />
      </div>
    </el-form-item>
    <div class="form-options">
      <el-checkbox v-model="rememberMe">记住我</el-checkbox>
      <a href="#" class="forgot-password">忘记密码?</a>
    </div>
    <el-form-item>
      <el-button :loading="loading" type="primary" class="login-button" @click="handleLogin">
        {{ loading ? "登录中..." : "登录" }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ElNotification, type FormInstance } from "element-plus";
import { User, Lock, ChatSquare } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { login } from "@/api/login";
import type { LoginForm } from "@/types/login";
import { useUserInfoStore } from "@/store";
import { getCode } from "@/api/public";

const userInfoStore = useUserInfoStore();

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const loginFormRef = ref<FormInstance>();
const rememberMe = ref(false);

const codeUrl = ref("");

// 登录表单数据
const loginForm = reactive<LoginForm>({
  account: "admin",
  password: "123456",
  code: "",
  codeKey: "",
});

// 表单验证规则
const loginRules = {
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 20, message: "账号长度应在 3 到 20 个字符之间", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应在 6 到 20 个字符之间", trigger: "blur" },
  ],
};

// 登录处理函数
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate(async (valid, fields) => {
    if (!valid) return;
    try {
      loading.value = true;

      const loginData: LoginForm = loginForm;
      const response = await login(loginData);

      // 登录成功
      const { token_type, access_token, refresh_token, userInfo } = response.data;
      // 存储token
      if (access_token) {
        userInfoStore.setTokenType(token_type);
        userInfoStore.setToken(access_token);
        userInfoStore.setRfreshToken(refresh_token);
        userInfoStore.setUserInfo(userInfo);

        // 如果选择了"记住我"，可以设置token的过期时间更长
        if (rememberMe.value) {
          userInfoStore.setLoginForm(loginData);
          userInfoStore.setRememberMe(true);
        }
      }

      ElNotification({
        title: "登录成功",
        message: "欢迎回来，" + userInfo.nickName,
        type: "success",
      });

      // 如果有重定向参数，则跳转到该页面，否则跳转到首页
      const redirectPath = (route.query.redirect as string) || "/";
      router.push(redirectPath);
    } catch (error: any) {
      handleeGetCode();
    } finally {
      loading.value = false;
    }
  });
};

// 获取记住登录状态
const getRememberMeStatus = () => {
  const rememberMeStatus = userInfoStore.rememberMe;
  if (rememberMeStatus) {
    rememberMe.value = true;
    const loginData = userInfoStore.getLoginForm();
    if (loginData) {
      const { account, password } = loginData;
      loginForm.account = account;
      loginForm.password = password;
    }
  }
};
getRememberMeStatus();

// 获取验证码
const handleeGetCode = async () => {
  const res = await getCode();
  loginForm.codeKey = res.data.codeKey;
  codeUrl.value = res.data.url;
};
handleeGetCode();
</script>

<style lang="scss" scoped>
// 登录表单
.login-form {
  margin-top: 30px;

  .row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  // 表单元素样式
  .custom-input {
    :deep(.el-input__wrapper) {
      padding: 12px 15px;
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 0 0 1px rgba(24, 144, 255, 0.3);
      }

      &.is-focus {
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 14px;

    .forgot-password {
      color: #1890ff;
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: #40a9ff;
        text-decoration: underline;
      }
    }
  }

  .login-button {
    width: 100%;
    padding: 12px 20px;
    font-size: 16px;
    border-radius: 8px;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border: none;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
    }
  }
}
</style>
