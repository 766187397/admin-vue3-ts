<template>
  <el-drawer v-model="drawer" direction="rtl" size="380px" @open="handleOpen" :before-close="handleCancel">
    <template #header>
      <div>偏好设置</div>
    </template>
    <template #default>
      <el-form :model="config" label-width="auto">
        <div class="drawer_title">主题</div>
        <el-form-item label="主题：">
          <el-color-picker v-model="config.themeColor" @change="handleThemeChange" />
        </el-form-item>
        <div class="drawer_title">组件</div>
        <el-form-item label="组件尺寸：">
          <el-select v-model="config.size" placeholder="设置组件尺寸">
            <el-option label="较大" value="large" />
            <el-option label="正常" value="default" />
            <el-option label="较小" value="small" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="drawer = false">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
  import { useElConfigStore } from "@/store";
  const elConfigStore = useElConfigStore();
  const { changeThemeColor } = elConfigStore;

  let drawer = defineModel("drawer", {
    default: false,
    type: Boolean,
  });

  // 偏好设置开关
  // const drawer = ref<boolean>(false);
  let restored: any = {};
  const config = computed(() => elConfigStore.config);
  // 开启
  const handleOpen = () => {
    restored = { ...elConfigStore.config };
  };
  // 关闭
  const handleCancel = () => {
    ElMessageBox.confirm("取消会将丢失已修改的设置", "提示").then(() => {
      drawer.value = false;
      elConfigStore.setConfig(restored);
      changeThemeColor(restored?.themeColor as string);
    });
  };
  // 设置主题颜色
  const handleThemeChange = (color: string | null) => {
    if (color) {
      changeThemeColor(color);
    }
  };
</script>

<style lang="scss" scoped>
  :deep(.el-drawer) {
    .el-drawer__header {
      margin-bottom: 0;
    }

    .drawer_title {
      font-size: 16px;
      font-weight: 700;
      line-height: 1.5em;
    }
  }
</style>
