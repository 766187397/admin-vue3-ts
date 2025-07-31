<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-icon size="20"><Bell /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="(item, index) in noticeList" :key="index" @click="clickItem(item)">
          {{ item.title }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import { useUserInfoStore } from "@/store";
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

const clickItem = (item: any) => {
  console.log("点击通知:", item);
  // 后续写了详情跳转到详情页面
};
</script>

<style lang="scss" scoped></style>
