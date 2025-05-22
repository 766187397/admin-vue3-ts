<template>
  <el-menu :default-active="activeMenu" class="menu" :router="true" :collapse="isCollapse">
    <menu-content :menu-list="menuList" />
  </el-menu>
</template>

<script setup lang="ts">
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
  const menuList = ref([
    {
      path: "/dashboard",
      meta: {
        title: "仪表盘",
        icon: "Odometer",
      },
    },
    {
      path: "/system",
      meta: {
        title: "系统管理",
        icon: "Setting",
      },
      children: [
        {
          path: "/system/user",
          meta: {
            title: "用户管理",
            icon: "User",
          },
        },
        {
          path: "/system/role",
          meta: {
            title: "角色管理",
            icon: "UserFilled",
          },
        },
        {
          path: "/system/menu",
          meta: {
            title: "菜单管理菜单管理菜单管理",
            icon: "Menu",
          },
          children: [
            {
              path: "/system/menu/list",
              meta: {
                title: "菜单列表",
                icon: "List",
              },
            },
            {
              path: "/system/menu/create",
              meta: {
                title: "创建菜单",
                icon: "Plus",
              },
            },
          ],
        },
      ],
    },
    {
      path: "/about",
      meta: {
        title: "关于系统",
        icon: "InfoFilled",
        disabled: true,
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
