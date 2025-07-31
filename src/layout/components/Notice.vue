<template>
  <el-icon size="20" @click="drawer = true"><Bell /></el-icon>

  <el-drawer v-model="drawer" title="通知公告" size="500" @open="handleOpen">
    <div
      class="list"
      v-infinite-scroll="getTableData"
      :infinite-scroll-disabled="isDisabled"
      :infinite-scroll-immediate="false"
      infinite-scroll-distance="20"
      v-loading="loading"
    >
      <div class="item" v-for="item in tableData" :key="item.id">
        <div class="title">{{ item.title }}</div>
        <div class="content" v-html="item.content"></div>
        <div class="time">{{ item.createdAt }}</div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import { useUserInfoStore } from "@/store";
import { getNoticeByUserOrRoleAdmin } from "@/api/notice.ts";
const userInfoStore = useUserInfoStore();
const token = userInfoStore.token_type + userInfoStore.token;
const baseUrl = import.meta.env.VITE_BASE_URL;

const noticeList = ref<any[]>([]);
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
  noticeList.value = data.data;
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
const tableData = ref([]);
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
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  height: 100%;
  overflow: auto;

  .item {
    padding: 10px;
    box-sizing: border-box;
    margin: 20px;
    border-radius: 12px;
    box-shadow: var(--el-box-shadow-lighter);

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
}
</style>
