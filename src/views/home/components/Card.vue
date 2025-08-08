<template>
  <div class="card">
    <div class="title">{{ info.title }}</div>
    <div class="row">
      <div class="item text">{{ info.dayNum }}</div>
      <img class="item icon" :src="info.icon" alt="" />
    </div>
    <div class="row">
      <div class="item">总用户量</div>
      <div class="item">{{ info.dataNum }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InfoCardProps {
  title: string;
  dayNum: string;
  dataNum: string;
  icon: string;
}

const { info } = defineProps<{
  info: InfoCardProps;
}>();
</script>

<style lang="scss" scoped>
.card {
  background: var(--bg-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: var(--el-box-shadow-lighter);

  .title {
    font-size: 20px;
    font-weight: 600;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    .text {
      font-size: 20px;
    }
    .icon {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
