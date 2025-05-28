<template>
  <!--  @contextmenu.prevent="handleContextmenu" -->
  <div class="contextmenu">
    <slot></slot>

    <div class="contextmenu_list" :style="{ top: top + 'px', left: left + 'px' }" v-show="show">
      <div
        class="contextmenu_list_item"
        v-for="(item, index) in eventList"
        :key="index"
        @click.prevent="handleClick(item)">
        <i class="contextmenu_icon" v-if="item.icon" :class="item.icon"></i>
        <div class="content" v-html="item.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface EventList {
    icon?: string;
    content: string;
    click: Function;
    [key: string]: any;
  }

  const { eventList } = defineProps<{
    eventList: EventList[];
  }>();

  const show = ref(false);
  const top = ref(0);
  const left = ref(0);
  const handleContextmenu = (event: MouseEvent) => {
    top.value = event.clientY;
    left.value = event.clientX;
    show.value = true;
  };

  /** 如果传入的函数返回的是true就不执行默认关闭 */
  const handleClick = (item: EventList) => {
    const res = item.click();
    if (res) {
      return;
    }
    show.value = false;
  };

  // 点击其他地方关闭菜单
  const handleClickOutside = (event: MouseEvent) => {
    show.value = false;
  };

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  // 暴露方法给父组件使用
  defineExpose({
    handleClickOutside,
    handleContextmenu,
  });
</script>

<style scoped>
  .contextmenu {
    width: 100%;
    height: 100%;
  }
  .contextmenu_list {
    position: fixed;
    top: 0;
    left: 0;
    min-width: 100px;
    height: auto;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  .contextmenu_list_item {
    cursor: pointer;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #2c2c2c;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .contextmenu_list_item:hover {
    background-color: #f5f5f5;
  }
  .contextmenu_icon {
    font-size: 12px;
    margin-right: 10px;
  }
</style>
