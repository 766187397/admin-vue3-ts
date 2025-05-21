<template>
  <div>test</div>
</template>

<script setup lang="ts">
  import { test } from "@/api/test";
  test().then((res) => {
    console.log(res);
  });
</script>

<style scoped></style>
