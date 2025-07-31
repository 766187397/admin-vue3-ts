<template>
  <el-icon size="20" @click="drawer = true"><Bell /></el-icon>

  <el-drawer v-model="drawer" title="通知公告" size="500" @open="handleOpen">
    <div
      class="list"
      v-infinite-scroll="getTableData"
      :infinite-scroll-disabled="isDisabled"
      :infinite-scroll-immediate="false"
      :infinite-scroll-delay="500"
      infinite-scroll-distance="20"
    >
      <div class="item" v-for="item in tableData" :key="item.id">
        <i class="iconfont icon-biaoqian" :class="{ active: item.status }" @click="handleReadNotice(item)"></i>
        <div class="title">{{ item.title }}</div>
        <div class="content" v-html="item.content"></div>
        <div class="time">{{ item.createdAt }}</div>
      </div>

      <p class="text_center" v-if="loading">加载中...</p>
      <p class="text_center" v-if="isDisabled">没有更多数据了</p>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import { useUserInfoStore } from "@/store";
import { getNoticeByUserOrRoleAdmin, signReadNotice } from "@/api/notice.ts";
import type { FindUserOrRole } from "@/types/notice";
const userInfoStore = useUserInfoStore();
const token = userInfoStore.token_type + userInfoStore.token;
const baseUrl = import.meta.env.VITE_BASE_URL;

const noticeList = ref<FindUserOrRole[]>([]);
// 连接指定命名空间
const socket = io(`${baseUrl}/api/v1/admin/notice/ws`, {
  transports: ["websocket"], // 强制使用 WebSocket 协议
  query: {
    token,
  },
});

socket.on("connect", () => {
  console.log(" 已连接到命名空间 /api/v1/admin/notice/ws");
});

// 接收命名空间专属消息
socket.on("list", (data) => {
  console.log(" 收到通知:", data);
  noticeList.value = data.data as FindUserOrRole[];
  noticeList.value.forEach((item: FindUserOrRole, index) => {
    setTimeout(() => {
      ElNotification({
        title: item.title,
        message: item.content,
      });
    }, 1 * index);
  });
});

// 接收命名空间专属消息
socket.on("update", (data) => {
  socket.emit("message", { token });
});

// 抽屉开关
const drawer = ref(false);
// 加载更多
const isDisabled = ref(false);
// 查询条件
const query = ref({
  page: 1,
  pageSize: 5,
});
// 数据
const tableData = ref<FindUserOrRole[]>([]);
// 加载状态
const loading = ref(false);

/** 查询数据 */
const getTableData = async (type: boolean = false) => {
  loading.value = true;
  let data = { ...query.value };
  const res = await getNoticeByUserOrRoleAdmin(data);
  tableData.value = [...tableData.value, ...res.data.data];
  loading.value = false;
  if (Number(query.value.pageSize) != res.data.data.length) {
    isDisabled.value = true;
  } else {
    query.value.page = query.value.page + 1;
  }
};

// 打开抽屉时的处理函数
const handleOpen = () => {
  tableData.value = [];
  query.value.page = 1;
  isDisabled.value = false;
  getTableData();
};

// 标记已读
const handleReadNotice = async (item: any) => {
  let res = await signReadNotice(item.id);
  item.status = true;
};
</script>

<style lang="scss" scoped>
@keyframes shrinkAndGrow {
  0% {
    transform: translate(10px, 0) scale(1);
  }
  50% {
    transform: translate(10px, 0) scale(0);
  }
  100% {
    transform: translate(10px, 0) scale(1);
  }
}

.list {
  width: 100%;
  height: 100%;
  overflow: auto;

  .item {
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    margin: 20px;
    border-radius: 12px;
    box-shadow: var(--el-box-shadow-lighter);

    .icon-biaoqian {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 24px;
      color: red;
      transform: translate(10px, 0);

      &.active {
        color: var(--el-color-primary);
        animation: shrinkAndGrow 0.5s ease-in-out forwards;
      }
    }

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .content {
      font-size: 14px;
      font-weight: 400;
    }

    .time {
      width: fit-content;
      margin-left: auto;
      font-size: 12px;
      color: #ccc;
    }
  }

  .text_center {
    text-align: center;
    color: #ccc;
  }
}
</style>
