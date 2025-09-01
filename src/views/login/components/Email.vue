<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="auto" class="login-form">
    <el-form-item prop="email">
      <el-input
        class="custom-input"
        v-model="loginForm.email"
        placeholder="请输入邮箱"
        :prefix-icon="Message"
        @change="form.email = loginForm.email" />
    </el-form-item>
    <el-form-item prop="emailCode">
      <div class="row">
        <el-input
          v-model="loginForm.emailCode"
          placeholder="请输入验证码"
          :prefix-icon="ChatLineSquare"
          show-password
          class="custom-input"
          @keyup.enter="handleLogin" />

        <el-button
          text
          type="primary"
          class="emailCode"
          @click="dialogFormVisible = true"
          :disabled="timer ? true : false">
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

  <el-dialog v-model="dialogFormVisible" title="验证码" width="500" @open="handleeGetCode" class="login-form">
    <el-form ref="dialogFormRef" :model="form" :rules="loginRules" label-width="auto">
      <el-form-item label="邮箱：" prop="email">
        <el-input
          class="custom-input"
          v-model="form.email"
          autocomplete="off"
          :prefix-icon="Message"
          @change="loginForm.email = form.email" />
      </el-form-item>
      <el-form-item label="验证码：" prop="code">
        <el-form-item prop="code">
          <div class="row">
            <el-input class="custom-input" v-model="form.code" :prefix-icon="ChatSquare" />
            <img :src="codeUrl" alt="验证码" @click="handleeGetCode" />
          </div>
        </el-form-item>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="getEmailCode"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, type FormInstance } from "element-plus";
import { Message, ChatLineSquare, ChatSquare } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { emailLogin } from "@/api/login";
import { getCode, sendEmail } from "@/api/public.ts";
import type { EmailLoginForm } from "@/types/login";
import { useUserInfoStore } from "@/store";
import type { SendEmailParams } from "@/types/email";

const userInfoStore = useUserInfoStore();

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const btnText = ref("获取验证码");
const time = ref(120);
const dialogFormVisible = ref(false);
const codeUrl = ref("");
// 登录表单数据
const loginForm = reactive<EmailLoginForm>({
  email: "",
  emailCode: "",
});

/** 发送邮箱 */
const form = reactive<SendEmailParams>({
  type: "loginCode",
  email: "",
  codeKey: "",
  code: "",
});

const timer = ref<number>();

const dialogFormRef = ref<FormInstance>();
// 获取验证码
const getEmailCode = () => {
  if (!dialogFormRef.value) return;
  dialogFormRef?.value.validate(async (valid, fields) => {
    if (!valid) return;
    if (timer.value) return;
    let res = await sendEmail(form);
    ElMessage({
      message: res.message || "操作成功",
      type: "success",
      duration: 5 * 1000,
    });
    // 关闭验证码界面，并初始化状态
    dialogFormVisible.value = false;
    form.codeKey = "";
    form.code = "";
    loginForm.emailCode = "";

    // 接口调用成功后执行
    timer.value = setInterval(() => {
      time.value--;
      btnText.value = time.value + "秒后重新获取";
      if (time.value <= 0) {
        clearInterval(timer.value);
        timer.value = undefined;
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
const validateEmailCode = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入验证码"));
  } else if (value.length == 6) {
    callback();
  } else {
    callback(new Error("邮箱验证码长度为 6 个字符"));
  }
};

// 表单验证规则
const loginRules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: ["blur", "change"] },
    { validator: validateEmail, trigger: ["blur", "change"] },
  ],
  emailCode: [
    { required: true, message: "请输入邮箱验证码", trigger: ["blur", "change"] },
    { validator: validateEmailCode, trigger: ["blur", "change"] },
  ],
  code: [
    { required: true, message: "请输入图形验证码", trigger: "blur" },
    { min: 4, max: 4, message: "验证码长度为 4 个字符", trigger: "blur" },
  ],
};

const loginFormRef = ref<FormInstance>();

// 登录处理函数
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate(async (valid, fields) => {
    if (!valid) return;
    try {
      loading.value = true;

      const loginData: EmailLoginForm = loginForm;
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
        message: "欢迎回来，" + userInfo.nickName,
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

// 获取验证码
const handleeGetCode = async () => {
  const res = await getCode();
  form.codeKey = res.data.codeKey;
  codeUrl.value = res.data.url;
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

    .emailCode {
      flex: 0 0 140px;
      height: 100%;
    }

    img {
      width: 150px;
      height: 50px;
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
