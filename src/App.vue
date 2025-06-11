<script setup lang="ts">
  import { RouterView } from "vue-router";
  import Loading from "@/components/public/Loading.vue";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <template #default>
        <!-- 套壳防止弹窗警告：<Suspense> slots expect a single root node. at <RouterView > at <App> -->
        <div class="app">
          <component :is="Component" />
        </div>
      </template>
      <template #fallback>
        <Loading />
      </template>
    </Suspense>
  </RouterView>
</template>

<style scoped></style>
