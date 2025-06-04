<script setup lang="ts">
  import { RouterView } from "vue-router";
  import { useLocaleStore } from "@/store/index.ts";
  const localeStore = useLocaleStore();
  const { config } = localeStore;
</script>

<template>
  <el-config-provider v-bind="config">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
