<template>
  <div class="main">
    <el-config-provider :size="config.size">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <component :is="Component" />
        </template>
        <Loading v-else />
      </RouterView>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
  import { RouterView } from "vue-router";
  import Loading from "@/components/public/Loading.vue";
  import { useElConfigStore } from "@/store/index.ts";
  const elConfigStore = useElConfigStore();
  const config = computed(() => elConfigStore.config);
</script>

<style scoped></style>
