<template>
  <div class="large" v-if="currentUpload">
    <el-button
      class="upload"
      plain
      @click="pause"
      v-if="isUploading"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false">
      {{ isHovered ? "暂停" : progress }}
    </el-button>
    <el-button class="upload" type="primary" plain @click="proceed" v-else>继续</el-button>
    <el-button class="upload" type="danger" plain @click="cancel">取消 </el-button>
  </div>
  <div class="small" v-else>
    <el-button class="upload" type="primary" plain>
      添加
      <input class="upload_input" type="file" name="file" @change="handleFileChange" />
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useLargeFilesStore } from "@/store";
import { largeFileUploadSecond, uploadFile } from "@/api/file";
import { calcSHA256 } from "@/utils/largeFile/largeFileHash";

const largeFilesStore = useLargeFilesStore();
const { upload, cancel, pause, proceed } = largeFilesStore;

const isHovered = ref(false);

// 是否正在上传
const isUploading = computed(() => {
  return largeFilesStore.isUploading;
});

// 当前上传实例
const currentUpload = computed(() => {
  return largeFilesStore.currentUpload;
});

// 进度
const progress = computed(() => {
  return `${largeFilesStore.progress} %`;
});

// 1. 定义可触发的事件名（可选，利于类型推断）
const emit = defineEmits(["uploadSuccess"]);

/** 文件上传 */
const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) {
    ElMessage.success("请选择文件");
    return;
  }
  const size = (file?.size || 0) / 1024 / 1024;
  const data = new FormData();
  data.append("file", file);
  if (size >= 20) {
    const hash = await calcSHA256(file);
    const res = await largeFileUploadSecond({ hash, size: file?.size });
    if (res.data) {
      ElMessage.success(res.message);
    } else {
      await upload(file, hash);
    }
  } else {
    const res = await uploadFile(data);
    ElMessage.success(res.message);
  }

  emit("uploadSuccess");
};
</script>

<style lang="scss" scoped>
.upload {
  position: relative;

  .upload_input {
    cursor: pointer;
    position: absolute;
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
