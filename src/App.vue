<script setup lang="ts">
  import { RouterView } from "vue-router";
  import Loading from "@/components/public/Loading.vue";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />
      <template #fallback>
        <Loading />
      </template>
    </Suspense>
  </RouterView>
</template>

<style scoped></style>
