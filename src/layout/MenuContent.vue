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
    <el-menu-item v-else :index="item.path" :disabled="item.meta?.disabled">
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <span class="title">{{ item.meta?.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
  interface MenuItem {
    path: string;
    meta?: {
      title?: string;
      icon?: string;
      disabled?: boolean;
    };
    children?: MenuItem[];
  }

  defineProps<{
    menuList: MenuItem[];
  }>();
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
