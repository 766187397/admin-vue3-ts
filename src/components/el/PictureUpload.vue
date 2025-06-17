<template>
  <el-upload
    class="avatar-uploader"
    drag
    with-credentials
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
  import { useUserInfoStore } from "@/store";
  const action = import.meta.env.VITE_BASE_URL + "/api/v1/upload/file";
  const userInfoStore = useUserInfoStore();
  const token = userInfoStore.token;
  const headers = {
    Authorization: token.startsWith("Bearer ") ? token : "Bearer " + token,
  };

  const imageUrl = ref("");

  /** 上传前 */
  const beforeAvatarUpload = (file: any) => {};

  /** 上传成功 */
  const handleAvatarSuccess = (ref: any, file: any) => {};

  /** 上传失败 */
  const handleAvatarError = (err: any, file: any) => {};
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
