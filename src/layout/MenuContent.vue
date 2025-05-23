<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 有子菜单的情况 -->
    <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
      <template #title>
        <template v-if="item.meta?.icon">
          <el-icon v-if="elementPlusIcons.includes(item.meta.icon)">
            <component :is="item.meta.icon" />
          </el-icon>
          <i v-else class="customize_icon" :class="item.meta.icon"></i>
        </template>
        <span class="title">{{ item.meta?.title }}</span>
      </template>
      <!-- 递归调用自身 -->
      <menu-content :menu-list="item.children" />
    </el-sub-menu>

    <!-- 无子菜单的情况 -->
    <el-menu-item v-else :index="item.path" :disabled="item.meta?.status === 0" @click="handleClick(item)">
      <el-icon v-if="elementPlusIcons.includes(item.meta.icon)">
        <component :is="item.meta.icon" />
      </el-icon>
      <i v-else class="customize_icon" :class="item.meta.icon"></i>
      <span class="title">{{ item.meta?.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
  import { type RoleRoutes } from "@/types/menu";
  import * as ElementPlusIconsVue from "@element-plus/icons-vue";
  import { customIcons } from "@/assets/icon/test/iconList.ts";
  defineProps<{
    menuList: RoleRoutes[];
  }>();
  console.log("customIcons", customIcons);
  const handleClick = (item: RoleRoutes) => {
    if (item.meta?.externalLinks) {
      console.log("item", item);
      window.open(item.path, "_blank");
    }
  };

  const elementPlusIcons: string[] = Object.keys(ElementPlusIconsVue);
</script>

<style scoped>
  .customize_icon {
    /* 自定义图标 24px 是根据如果改了原本的宽度也记得看看这里 --el-menu-icon-width */
    width: 24px;
    height: 1em;
    margin-right: 5px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
    flex-shrink: 0;
    color: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
  }

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
