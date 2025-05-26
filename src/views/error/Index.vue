<template>
  <div class="not-found">
    <div class="content">
      <h1>{{ errorCode }}</h1>
      <p>{{ errorMessage }}</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from "vue-router";

  const router = useRouter();

  const { errorCode = 404, errorMessage = "抱歉，您访问的页面不存在" } = defineProps<{
    errorCode?: number | string;
    errorMessage?: string;
  }>();

  const goHome = () => {
    router.push("/");
  };
</script>

<style scoped>
  .not-found {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
  }

  .content {
    text-align: center;
  }

  h1 {
    font-size: 120px;
    color: #409eff;
    margin: 0;
    line-height: 1.2;
  }

  p {
    font-size: 24px;
    color: #606266;
    margin: 20px 0 30px;
  }
</style>
