<template>
  <div class="header">
    <div class="navbar">
      <div class="left">
        <div class="is_collapse">
          <el-icon size="20" v-if="isCollapse"><Expand /></el-icon>
          <el-icon size="20" v-else><Fold /></el-icon>
        </div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in matched" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="right">

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
  const isCollapse = menuStore.isCollapse;
  const matched = rouet.matched;
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
    }
  }
</style>
