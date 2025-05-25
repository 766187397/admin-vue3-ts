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
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar shape="square" size="default" src="" />
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="tabs"></div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter, useRoute } from "vue-router";
  import { useMenuStore } from "@/store";
  const router = useRouter();
  const rouet = useRoute();
  const menuStore = useMenuStore();
  const isCollapse = computed(() => {
    return menuStore.isCollapse;
  });
  const matched = rouet.matched;

  const handleCollapse = () => {
    menuStore.setIsCollapse(!isCollapse.value);
  };
  const logout = () => {
    console.log("退出登录");
  };
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
        :deep(.el-dropdown) {
          cursor: pointer;
        }
      }
    }
  }
</style>
