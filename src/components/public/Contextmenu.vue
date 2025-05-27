<template>
  <div class="contextmenu" @contextmenu.prevent="handleContextmenu">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  const handleContextmenu = (e: MouseEvent) => {
    console.log("e", e);
  };
</script>

<style scoped>
  .contextmenu {
  }
</style>
