<template>
  <div class="header">
    <div class="navbar">
      <div class="is_collapse">
        <el-icon size="20" v-if="isCollapse"><Expand /></el-icon>
        <el-icon size="20" v-else><Fold /></el-icon>
      </div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>promotion list</el-breadcrumb-item>
        <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabs"></div>
  </div>
</template>

<script setup lang="ts">
  import { useMenuStore } from "@/store";
  const router = useRouter();
  const rouet = useRoute();
  const menuStore = useMenuStore();
  const isCollapse = menuStore.isCollapse;
  console.log("rouet", rouet);
  console.log("router", router);
</script>

<style lang="scss" scoped>
  .header {
    padding: 15px 0;
    box-sizing: border-box;

    .is_collapse {
      cursor: pointer;
    }
  }
</style>
