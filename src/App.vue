<script setup lang="ts">
  import { RouterView } from "vue-router";
  import Loading from "@/components/public/Loading.vue";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <component :is="Component" />
    </template>
    <Loading v-else />
  </RouterView>
</template>

<style scoped></style>
