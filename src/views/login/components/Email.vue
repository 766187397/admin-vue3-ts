<template>
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
    <el-form-item>
      <el-button :loading="loading" type="primary" class="login-button" @click="handleLogin">
        {{ loading ? "登录中..." : "登录" }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { ElNotification, type FormInstance } from "element-plus";
  import { User, Lock } from "@element-plus/icons-vue";
  import { useRouter, useRoute } from "vue-router";
  import { login } from "@/api/login";
  import type { LoginForm } from "@/types/login";
  import { useUserInfoStore } from "@/store";

  const userInfoStore = useUserInfoStore();

  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);
  const loginFormRef = ref<FormInstance>();

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
      if (!valid) return;
      try {
        loading.value = true;

        const loginData: LoginForm = {
          account: loginForm.account,
          password: loginForm.password,
        };
        const response = await login(loginData);

        // 登录成功
        const { token_type, access_token, refresh_token, userInfo } = response.data;
        // 存储token
        if (access_token) {
          userInfoStore.setTokenType(token_type);
          userInfoStore.setToken(access_token);
          userInfoStore.setRfreshToken(refresh_token);
          userInfoStore.setUserInfo(userInfo);
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
      } finally {
        loading.value = false;
      }
    });
  };
</script>

<style lang="scss" scoped>
  // 登录表单
  .login-form {
    margin-top: 30px;

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
