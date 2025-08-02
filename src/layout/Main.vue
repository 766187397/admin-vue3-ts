<template>
  <div class="main">
    <el-config-provider :size="config.size">
      <RouterView v-slot="{ Component }">
        <Suspense>
          <template #default>
            <component :is="Component" />
          </template>
          <template #fallback>
            <Loading />
          </template>
        </Suspense>
      </RouterView>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
  import { RouterView } from "vue-router";
  import Loading from "@/components/public/Loading.vue";
  import { useElConfigStore } from "@/store/index.ts";
  import {countElTableHeight} from '@/hooks/elTableHeigth';
  const elConfigStore = useElConfigStore();
  const config = computed(() => elConfigStore.config);

  onBeforeRouteUpdate(()=>{
    // nextTick 是微任务DOM 更新后立即执行，不一定是渲染完成
    // setTimeout 宏任务，下一个事件循环
    setTimeout(()=>{
      countElTableHeight();
    },0)
  })

  onMounted(() => {
    countElTableHeight();
    window.addEventListener("resize", countElTableHeight);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", countElTableHeight);
  });
</script>

<style scoped></style>
