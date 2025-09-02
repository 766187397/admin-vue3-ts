<template>
  <el-upload
    v-loading="loading"
    class="avatar-uploader"
    drag
    :headers="headers"
    :action="action"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :on-error="handleAvatarError"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";

let imageUrl = defineModel("imageUrl", { type: String, default: "" });

const loading = ref(false);

const { maxSize = 5 } = defineProps<{
  maxSize?: number;
}>();

const action = import.meta.env.VITE_BASE_URL + "/api/v1/upload/file";
const token = localStorage.getItem("token");
const headers = {
  Authorization: token?.startsWith("Bearer ") ? token : "Bearer " + token,
};

/** 上传前 */
const beforeAvatarUpload = (file: any) => {
  loading.value = true;

  const mb = file.size / 1024 / 1024;
  if (mb > maxSize) {
    ElMessage.error("上传图片大小不能超过" + maxSize + "MB!");
    return false;
  }
  if (file.type.indexOf("image") == -1) {
    ElMessage.error("上传图片格式不正确!");
    return false;
  }
};

const emit = defineEmits(["updateSuccess", "updateError"]);

/** 上传成功 */
const handleAvatarSuccess = (res: any, file: any) => {
  loading.value = false;
  emit("updateSuccess", res, file);
};

/** 上传失败 */
const handleAvatarError = (err: any, file: any) => {
  loading.value = false;
  const res = JSON.parse(err.message);
  ElMessage.error(res.message);
  emit("updateError", err, file);
};
</script>

<style lang="scss" scoped>
.avatar-uploader {
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
