<template>
  <div class="tags">
    <Contextmenu :eventList="eventList" ref="contextmenu">
      <div class="tags_list">
        <el-tag
          v-for="tag in tags"
          :key="tag.name"
          :closable="tag.closable"
          :type="tag.type"
          @contextmenu.prevent="handleContextmenu($event, tag)"
          @close="handleCloseTag(tag)"
          @click="handleClickTags(tag)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </Contextmenu>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import Contextmenu from "@/components/public/Contextmenu.vue";
import type { TagProps } from "element-plus";

const router = useRouter();
const rouet = useRoute();

const matched = ref();
matched.value = rouet.matched.filter((item) => item.name !== "layout" && item.name !== "home");

interface TagsItem {
  name: string;
  type: TagProps["type"];
  path: string;
  closable: boolean;
}

/** 默认菜单项 */
const tags = ref<TagsItem[]>([{ name: "首页", type: "info", path: "/home", closable: false }]);

interface EventList {
  /** 图标类名 */
  icon?: string;
  /** 菜单项内容 */
  content: string;
  /** 点击回调函数 */
  click: Function;
  /** 菜单 */
  tag?: TagsItem;
  /** 其他可能的属性 */
  [key: string]: any;
}

// 默认菜单项
const defaultEventList: EventList[] = [
  {
    content: "关闭当前",
    icon: "iconfont icon-shuaxin",
    click() {
      if (this.tag) {
        handleCloseTag(this.tag);
      }
    },
  },
  {
    content: "关闭其他",
    icon: "iconfont icon-shuaxin",
    click() {
      if (this.tag) {
        tags.value = tags.value.filter((item) => item.path === this.tag?.path || item.path === "/home");
        router.push(this.tag.path);
      }
    },
  },
  {
    content: "关闭所有",
    icon: "iconfont icon-shuaxin",
    click() {
      tags.value = tags.value.filter((item) => item.path === "/home");
      router.push("/home");
    },
  },
  {
    content: "刷新页面",
    icon: "iconfont icon-guanbi",
    click() {
      router.go(0);
    },
  },
];

// 右键菜单
const eventList = toRef([...defaultEventList]);

const contextmenu = useTemplateRef<typeof Contextmenu>("contextmenu");
/** 点击标签 */
const handleClickTags = (tag: TagsItem) => {
  if (tag.path !== rouet.path) {
    router.push(tag.path);
  }
};

/** 右键菜单 */
const handleContextmenu = (event: MouseEvent, tag: TagsItem) => {
  if (tag.path === "/home") {
    eventList.value = eventList.value.filter((item) => item.content !== "关闭当前");
  } else {
    eventList.value = [...defaultEventList];
  }
  eventList.value.forEach((item) => {
    item.tag = tag;
  });
  contextmenu.value?.handleContextmenu(event);
};

/** 关闭标签 */
const handleCloseTag = (tag: TagsItem) => {
  tags.value = tags.value.filter((item) => item.path !== tag.path);
  if (tag.path === rouet.path) {
    router.push(tags.value[tags.value.length - 1].path);
  }
};

/** 处理菜单 */
const handleTags = (rouet: any) => {
  tags.value.forEach((item) => {
    if (item.path === rouet.path) {
      item.type = "primary";
    } else {
      item.type = "info";
    }
  });
  if (tags.value.some((item) => item.path === rouet.path)) return;
  tags.value.push({
    name: rouet.meta?.title as string,
    type: "primary",
    path: rouet.path,
    closable: true,
  });
};

handleTags(rouet);

/** 路由更新 */
onBeforeRouteUpdate((to, from) => {
  handleTags(to);
  matched.value = to.matched.filter((item) => item.name !== "layout" && item.name !== "home");
});
</script>

<style lang="scss" scoped>
.tags {
  margin-top: 20px;
  .tags_list {
    display: flex;
    align-items: center;
    gap: 10px;

    :deep(.el-tag) {
      cursor: pointer;
    }
  }
}
</style>
