<template>
  <!-- :background-color="menuBackgroundColor" :text-color="menuTextColor" :active-text-color="menuActiveTextColor" -->
  <el-menu :default-active="activeMenu" class="menu" :router="true" :collapse="isCollapse">
    <menu-content :menu-list="menuList" />
  </el-menu>
</template>

<script setup lang="ts">
  import { useRoute } from "vue-router";
  import MenuContent from "./MenuContent.vue";
  import { useMenuStore } from "@/store";
  import type { RoleRoutes } from "@/types/menu";
  import { useElConfigStore } from "@/store/index";

  const elConfigStore = useElConfigStore();
  const config = computed(() => elConfigStore.config);
  let menuBackgroundColor = ref<string>();
  let menuTextColor = ref<string>();
  let menuActiveTextColor = ref<string>();
  watch(
    config,
    (val) => {
      if (config.value.menuDarkTheme) {
        menuBackgroundColor.value = "#1e293b";
        menuTextColor.value = "#ffffff";
        menuActiveTextColor.value = "#409eff";
      } else {
        menuBackgroundColor.value = "#ffffff";
        menuTextColor.value = "#1e293b";
        menuActiveTextColor.value = "#409eff";
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );

  const menuStore = useMenuStore();
  // 菜单是否折叠
  const isCollapse = computed(() => menuStore.isCollapse);

  // 获取当前路由路径作为默认激活菜单
  const route = useRoute();
  const activeMenu = computed(() => route.path);

  /**
   * 补齐前缀
   * @param {RoleRoutes[]} data 菜单数据
   * @param {RoleRoutes[]} data 菜单数据（补齐/）
   */
  const handleMenuData = (data: RoleRoutes[]): RoleRoutes[] => {
    return data.map((item) => {
      if (!item.path.startsWith("/")) {
        item.path = "/" + item.path;
      }
      if (item.children) {
        item.children = handleMenuData(item.children);
      }
      return {
        ...item,
      };
    });
  };

  // 菜单数据
  const menuList = computed(() => handleMenuData(menuStore.menu));
</script>

<style lang="scss" scoped>
  .menu {
    height: calc(100% - 60px);
    // height: 100%;
    border-right: none;
    transition: all 0.3s;
    overflow: auto;
  }

  .menu:not(.el-menu--collapse) {
    width: 100%;
  }
</style>
