<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-box">
        <div class="login-header">
          <div class="logo-container">
            <div class="logo">
              <el-icon class="logo-icon">
                <Monitor />
              </el-icon>
            </div>
          </div>
          <h2 class="login-title">{{ title }}</h2>
          <p class="login-subtitle">欢迎回来，请登录您的账号</p>
        </div>

        <Password />
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
  import Password from "./components/Password.vue";
  import { Monitor } from "@element-plus/icons-vue";

  const title = ref("管理系统");
</script>

<style lang="scss" scoped>
  // 变量定义
  $primary-color: #1890ff;
  $primary-gradient: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  $button-gradient: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  $text-primary: #303133;
  $text-secondary: #909399;
  $box-shadow-light: 0 8px 24px rgba(0, 0, 0, 0.05);
  $box-shadow-medium: 0 12px 36px rgba(0, 0, 0, 0.1);
  $box-shadow-button: 0 4px 12px rgba(24, 144, 255, 0.4);
  $border-radius-base: 8px;
  $border-radius-large: 12px;
  $border-radius-logo: 16px;
  $transition-base: all 0.3s ease;

  // 动画
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  // 主容器
  .login-container {
    display: flex;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    background-color: #f0f2f5;

    // 左侧登录区域
    .login-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 1;
      padding: 20px;

      // 登录框
      .login-box {
        width: 400px;
        padding: 40px;
        background-color: white;
        border-radius: $border-radius-large;
        box-shadow: $box-shadow-light;
        transition: $transition-base;

        &:hover {
          box-shadow: $box-shadow-medium;
        }

        // 登录头部
        .login-header {
          text-align: center;
          margin-bottom: 30px;

          .logo-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;

            .logo {
              width: 64px;
              height: 64px;
              background: $primary-gradient;
              border-radius: $border-radius-logo;
              display: flex;
              justify-content: center;
              align-items: center;
              color: white;
              font-size: 32px;
              box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);

              .logo-icon {
                font-size: 32px;
              }
            }
          }

          .login-title {
            font-size: 24px;
            color: $text-primary;
            font-weight: 600;
            margin-bottom: 8px;
          }

          .login-subtitle {
            color: $text-secondary;
            font-size: 14px;
          }
        }
      }

      // 页脚
      .login-footer {
        margin-top: 40px;
        text-align: center;
        color: $text-secondary;
        font-size: 14px;
      }
    }

    // 右侧装饰区域
    .login-decoration {
      flex: 1;
      background: $primary-gradient;
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
    }
  }

  // 响应式设计
  @media (max-width: 992px) {
    .login-container {
      .login-decoration {
        display: none;
      }

      .login-content {
        width: 100%;
      }
    }
  }

  @media (max-width: 576px) {
    .login-container {
      .login-content {
        .login-box {
          width: 100%;
          padding: 30px 20px;
        }
      }
    }
  }
</style>
