<template>
  <el-menu :default-active="activeMenu" class="menu" :router="true" :collapse="isCollapse">
    <menu-content :menu-list="menuList" />
  </el-menu>
</template>

<script setup lang="ts">
  import { type RoleRoutes } from "@/types/menu";
  import { ref, computed } from "vue";
  import { useRoute } from "vue-router";
  import MenuContent from "./MenuContent.vue";

  // 菜单是否折叠
  const isCollapse = ref(false);

  // 获取当前路由路径作为默认激活菜单
  const route = useRoute();
  const activeMenu = computed(() => {
    return route.path;
  });

  // 菜单数据
  const menuList = ref<RoleRoutes[]>([
    {
      path: "/home",
      name: "home",
      component: "Home",
      meta: {
        title: "首页",
        icon: "home",
        externalLinks: true,
      },
    },
    {
      path: "/about",
      name: "about",
      component: "About",
      meta: {
        title: "关于",
        icon: "about",
        externalLinks: false,
      },
    },
  ]);
</script>

<style lang="scss" scoped>
  .menu {
    height: 100%;
    border-right: none;
  }

  .menu:not(.el-menu--collapse) {
    width: 100%;
  }
</style>
