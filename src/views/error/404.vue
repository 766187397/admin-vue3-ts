<template>
  <Error></Error>
</template>

<script setup lang="ts">
  import Error from "./components/Error.vue";
  import { useRouter, useRoute } from "vue-router";
  const router = useRouter();
  const route = useRoute();
  console.log('router', router)
  console.log('route', route)
</script>

<style scoped></style>
