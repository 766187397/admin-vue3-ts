<template>
  <div class="header">
    <div class="navbar">
      <div class="left">
        <div class="is_collapse" @click="handleCollapse">
          <el-icon size="20" v-if="isCollapse"><Expand /></el-icon>
          <el-icon size="20" v-else><Fold /></el-icon>
        </div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in matched" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="right">
        <div class="r_item">
          <el-icon size="20" @click="enterFullScreen" v-if="!fullScreenState"><FullScreen /></el-icon>
          <el-icon size="20" @click="exitFullscreen" v-else><CopyDocument /></el-icon>
        </div>
        <div class="r_item">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar v-if="userInfo.avatar" shape="square" size="default" :src="userInfo.avatar" />
              <span v-else>{{ userInfo.nickName }}</span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="tags">
      <Contextmenu>
        <el-tag v-for="tag in tags" :key="tag.name" closable :type="tag.type">
          {{ tag.name }}
        </el-tag>
      </Contextmenu>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter, useRoute } from "vue-router";
  import { useUserInfoStore, useMenuStore, usePublicStore } from "@/store";
  import Contextmenu from "@/components/public/Contextmenu.vue";
  const router = useRouter();
  const rouet = useRoute();
  const publicStore = usePublicStore();
  const menuStore = useMenuStore();
  const userInfoStore = useUserInfoStore();

  const userInfo = computed(() => userInfoStore.userInfo);
  const isCollapse = computed(() => {
    return menuStore.isCollapse;
  });
  const matched = rouet.matched;
  // 控制折叠
  const handleCollapse = () => {
    menuStore.setIsCollapse(!isCollapse.value);
  };
  // 退出登录
  const { handleLogout } = userInfoStore;
  const { enterFullScreen, exitFullscreen, getFullScreenState } = publicStore;
  getFullScreenState();
  const fullScreenState = computed(() => publicStore.fullScreen);

  import type { TagProps } from "element-plus";

  interface TagsItem {
    name: string;
    type: TagProps["type"];
  }
  const tags = ref<TagsItem[]>([
    { name: "Tag 1", type: "primary" },
    { name: "Tag 2", type: "success" },
    { name: "Tag 3", type: "info" },
    { name: "Tag 4", type: "warning" },
    { name: "Tag 5", type: "danger" },
  ]);
</script>

<style lang="scss" scoped>
  .header {
    padding: 15px 0;
    box-sizing: border-box;

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        gap: 20px;

        .is_collapse {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }

      .right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;

        .r_item {
          cursor: pointer;
        }
        // :deep(.el-dropdown) {
        //   cursor: pointer;
        // }
      }
    }
    .tags {
      margin-top: 20px;
    }
  }
</style>
