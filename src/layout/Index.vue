<template>
  <div class="common-layout">
    <el-container>
      <el-aside
        class="aside"
        :class="{ darkTheme: config.menuDarkTheme }"
        :style="{ width: isCollapse ? '64px' : config.menuWidth + 'px' }">
        <RouterLink to="/" class="sidebar_logo">
          <img class="logo" src="@/assets/images/logo.jpg" alt="logo" />
          <h1 class="title" v-if="!showTitle">后台管理系统</h1>
        </RouterLink>
        <Menu />
      </el-aside>
      <el-container>
        <el-header :class="{ darkTheme: config.topTheme }"><Header /></el-header>
        <el-main><Main /></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
  import Menu from "./Menu.vue";
  import Header from "./Header.vue";
  import Main from "./Main.vue";
  import { useMenuStore, useElConfigStore } from "@/store";

  const elConfigStore = useElConfigStore();
  const config = computed(() => elConfigStore.config);

  const menuStore = useMenuStore();
  const showTitle = ref(false);

  // 菜单是否折叠
  const isCollapse = computed(() => menuStore.isCollapse);
  watch(
    isCollapse,
    (val) => {
      if (val) {
        showTitle.value = val;
      } else {
        setTimeout(() => {
          showTitle.value = val;
        }, 300);
      }
    },
    {
      immediate: true,
    }
  );
</script>
<style lang="scss" scoped>
  .aside {
    transition: all 0.3s;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;

    .sidebar_logo {
      cursor: pointer;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px;
      box-sizing: border-box;
      color: #000;
      text-decoration: none;
      transition: all 0.3s;

      .logo {
        width: 32px;
        height: 32px;
      }
      .title {
        font-size: 16px;
      }
    }
  }
  :deep(.el-header) {
    height: auto;
  }
</style>
