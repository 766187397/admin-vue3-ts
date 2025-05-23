<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-box">
        <div class="login-header">
          <div class="logo-container">
            <div class="logo">
              <el-icon class="logo-icon"><Monitor /></el-icon>
            </div>
          </div>
          <h2 class="login-title">{{ title }}</h2>
          <p class="login-subtitle">欢迎回来，请登录您的账号</p>
        </div>

        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0" class="login-form">
          <el-form-item prop="account">
            <el-input v-model="loginForm.account" placeholder="请输入账号" :prefix-icon="User" class="custom-input" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              class="custom-input"
              @keyup.enter="handleLogin" />
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
      </div>

      <div class="login-footer">
        <p>© {{ new Date().getFullYear() }} {{ title }} - 版权所有</p>
      </div>
    </div>

    <div class="login-decoration">
      <div class="decoration-content">
        <h1>欢迎使用{{ title }}</h1>
        <p>高效、安全、专业的企业级管理平台</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from "vue";
  import { ElMessage, ElNotification, type FormInstance } from "element-plus";
  import { User, Lock, Monitor } from "@element-plus/icons-vue";
  import { useRouter, useRoute } from "vue-router";
  import { login } from "@/api/login";
  import type { LoginForm, LoginResponse } from "@/types/login";
  import { useUserInfoStore } from "@/store";

  const userInfoStore = useUserInfoStore();

  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);
  const loginFormRef = ref<FormInstance>();
  const rememberMe = ref(false);

  const title = ref("管理系统");

  // 登录表单数据
  const loginForm = reactive<LoginForm>({
    account: "",
    password: "",
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
      if (valid) {
        try {
          loading.value = true;

          const loginData: LoginForm = {
            account: loginForm.account,
            password: loginForm.password,
          };
          const response: LoginResponse = await login(loginData);

          // 登录成功
          const { token_type, access_token, refresh_token, userInfo } = response.data;
          // 存储token
          if (response.data.access_token) {
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
            message: "欢迎回来，" + loginForm.account,
            type: "success",
          });

          // 如果有重定向参数，则跳转到该页面，否则跳转到首页
          const redirectPath = (route.query.redirect as string) || "/";
          router.push(redirectPath);
        } catch (error: any) {
          // 登录失败
          console.error("登录失败:", error);

          ElMessage({
            message: error.message || "登录失败，请检查账号和密码",
            type: "error",
            duration: 3000,
          });
        } finally {
          loading.value = false;
        }
      } else {
        console.log("表单验证失败", fields);
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
</script>

<style lang="scss" scoped>
  .login-container {
    display: flex;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    background-color: #f0f2f5;
  }

  .login-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    padding: 20px;
  }

  .login-decoration {
    flex: 1;
    background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 60%);
      animation: rotate 30s linear infinite;
    }
  }

  .decoration-content {
    text-align: center;
    padding: 0 40px;
    max-width: 500px;
    z-index: 1;
    h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      font-weight: 600;
    }
    p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .login-box {
    width: 400px;
    padding: 40px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
    }
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .logo-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .logo {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 32px;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  }

  .logo-icon {
    font-size: 32px;
  }

  .login-title {
    font-size: 24px;
    color: #303133;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .login-subtitle {
    color: #909399;
    font-size: 14px;
  }

  .login-form {
    margin-top: 30px;
  }

  .custom-input {
    :deep(.el-input__wrapper) {
      padding: 12px 15px;
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    :deep(.el-input__wrapper:hover) {
      box-shadow: 0 0 0 1px rgba(24, 144, 255, 0.3);
    }
    :deep(.el-input__wrapper.is-focus) {
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .forgot-password {
    color: #1890ff;
    text-decoration: none;
    transition: color 0.3s;
  }

  .forgot-password:hover {
    color: #40a9ff;
    text-decoration: underline;
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

  .login-footer {
    margin-top: 40px;
    text-align: center;
    color: #909399;
    font-size: 14px;
  }

  /* 响应式设计 */
  @media (max-width: 992px) {
    .login-decoration {
      display: none;
    }

    .login-content {
      width: 100%;
    }
  }

  @media (max-width: 576px) {
    .login-box {
      width: 100%;
      padding: 30px 20px;
    }
  }
</style>
