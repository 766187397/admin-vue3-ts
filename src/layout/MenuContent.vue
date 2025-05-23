<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 有子菜单的情况 -->
    <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span class="title">{{ item.meta?.title }}</span>
      </template>
      <!-- 递归调用自身 -->
      <menu-content :menu-list="item.children" />
    </el-sub-menu>

    <!-- 无子菜单的情况 -->
    <el-menu-item v-else :index="item.path" :disabled="item.meta?.status === 0" @click="handleClick(item)">
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <span class="title">{{ item.meta?.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
  import { type RoleRoutes } from "@/types/menu";

  defineProps<{
    menuList: RoleRoutes[];
  }>();

  const handleClick = (item: RoleRoutes) => {
    if (item.meta?.externalLinks) {
      console.log('item', item)
      window.open(item.path, "_blank");
    }
  };
</script>

<style scoped>
  .el-menu-item,
  .el-sub-menu {
    user-select: none;
  }

  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
