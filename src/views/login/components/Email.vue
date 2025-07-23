<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0" class="login-form">
    <el-form-item prop="email">
      <el-input v-model="loginForm.email" placeholder="请输入邮箱" :prefix-icon="Message" class="custom-input" />
    </el-form-item>
    <el-form-item prop="code">
      <div class="row">
        <el-input
          v-model="loginForm.code"
          placeholder="请输入验证码"
          :prefix-icon="ChatLineSquare"
          show-password
          class="custom-input"
          @keyup.enter="handleLogin" />

        <el-button text type="primary" class="code" @click="getCode" :disabled="timer ? true : false">
          {{ btnText }}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button :loading="loading" type="primary" class="login-button" @click="handleLogin">
        {{ loading ? "登录中..." : "登录" }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { ElMessage, ElNotification, type FormInstance } from "element-plus";
  import { Message, ChatLineSquare } from "@element-plus/icons-vue";
  import { useRouter, useRoute } from "vue-router";
  import { emailLogin } from "@/api/login";
  import { sendEmail } from "@/api/public.ts";
  import type { EmailLoginForm } from "@/types/login";
  import { useUserInfoStore } from "@/store";

  const userInfoStore = useUserInfoStore();

  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);
  const loginFormRef = ref<FormInstance>();
  const btnText = ref("获取验证码");
  const time = ref(120);

  // 登录表单数据
  const loginForm = reactive<EmailLoginForm>({
    account: "",
    password: "",
  });

  const timer = ref();
  // 获取验证码
  const getCode = () => {
    loginFormRef.value.validateField("email", async (valid, fields) => {
      if (!valid) return;

      if (timer.value) return;

      let res = await sendEmail("logonCode", loginForm.email);

      ElMessage({
        message: res.message || "操作成功",
        type: "success",
        duration: 5 * 1000,
      });

      // 接口调用成功后执行
      timer.value = setInterval(() => {
        time.value--;
        btnText.value = time.value + "秒后重新获取";
        if (time.value <= 0) {
          clearInterval(timer);
          timer.value = null;
          btnText.value = "获取验证码";
          time.value = 120;
        }
      }, 1000);
    });
  };

  // 验证邮箱
  const validateEmail = (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback(new Error("请输入邮箱"));
    } else if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      )
    ) {
      callback();
    } else {
      callback(new Error("邮箱格式错误"));
    }
  };

  // 验证验证码
  const validateCode = (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback(new Error("请输入验证码"));
    } else if (value.length == 6) {
      callback();
    } else {
      callback(new Error("验证码长度为 6 个字符"));
    }
  };

  // 表单验证规则
  const loginRules = {
    email: [
      { required: true, message: "请输入邮箱", trigger: ["blur", "change"] },
      { validator: validateEmail, trigger: ["blur", "change"] },
    ],
    code: [
      { required: true, message: "请输入验证码", trigger: ["blur", "change"] },
      { validator: validateCode, trigger: ["blur", "change"] },
    ],
  };

  // 登录处理函数
  const handleLogin = async () => {
    if (!loginFormRef.value) return;

    await loginFormRef.value.validate(async (valid, fields) => {
      if (!valid) return;
      try {
        loading.value = true;

        const loginData: EmailLoginForm = {
          email: loginForm.email,
          code: loginForm.code,
        };
        const response = await emailLogin(loginData);

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

    .row {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 20px;

      .code {
        flex: 0 0 140px;
        height: 100%;
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
