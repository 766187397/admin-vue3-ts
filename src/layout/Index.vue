<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="aside">
        <div class="sidebar_logo">
          <img class="logo" src="@/assets/images/logo.jpg" alt="logo" />
          <h1 class="title">后台管理系统</h1>
        </div>
        <Menu />
      </el-aside>
      <el-container>
        <el-header><Header /></el-header>
        <el-main><Main /></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
  import Menu from "./Menu.vue";
  import Header from "./Header.vue";
  import Main from "./Main.vue";
</script>
<style lang="scss" scoped>
  .aside {
    width: 200px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);

    .sidebar_logo {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px;
      box-sizing: border-box;

      .logo {
        width: 32px;
        height: 32px;
      }
      .title {
        font-size: 16px;
      }
    }
  }
</style>
