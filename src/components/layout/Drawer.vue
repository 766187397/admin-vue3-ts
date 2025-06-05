<template>
  <el-drawer v-model="drawer" direction="rtl" size="380px" @open="handleOpen" :before-close="handleCancel">
    <template #header>
      <div>偏好设置</div>
    </template>
    <template #default>
      <el-form :model="config" label-width="auto" label-position="left">
        <div class="drawer_title">主题</div>
        <div class="color_list">
          <div
            class="color_item"
            :style="{ background: item.color, cursor: config.darkTheme ? 'not-allowed' : 'pointer' }"
            v-for="(item, index) in colorList"
            :key="index"
            @click="handleThemeChange(item.color)">
            <div class="color_name">{{ item.name }}</div>
          </div>
        </div>
        <el-form-item label="自定义主题：">
          <el-color-picker v-model="config.themeColor" @change="handleThemeChange" :disabled="config.darkTheme" />
        </el-form-item>
        <el-form-item label="暗色主题：">
          <el-switch
            v-model="config.darkTheme"
            style="--el-switch-on-color: #2c2c2c; --el-switch-off-color: #f2f2f2"
            active-action-icon="Moon"
            inactive-action-icon="Sunny"
            @click="handleAnimation($event)" />
        </el-form-item>
        <el-form-item label="侧边菜单深色模式：">
          <el-switch v-model="config.menuDarkTheme" :disabled="config.darkTheme" />
        </el-form-item>
        <el-form-item label="顶部深色模式：">
          <el-switch v-model="config.topTheme" :disabled="config.darkTheme" />
        </el-form-item>
        <div class="drawer_title">组件</div>
        <el-form-item label="组件尺寸：">
          <el-select v-model="config.size" placeholder="设置组件尺寸">
            <el-option label="较大" value="large" />
            <el-option label="正常" value="default" />
            <el-option label="较小" value="small" />
          </el-select>
        </el-form-item>
        <el-form-item label="左侧菜单宽度：">
          <el-input-number v-model="config.menuWidth" :min="0">
            <template #suffix>
              <span>px</span>
            </template>
          </el-input-number>
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
  const { changeThemeColor, handleAnimation } = elConfigStore;
  // 设置缓存颜色
  changeThemeColor(elConfigStore.config.themeColor);
  let drawer = defineModel("drawer", {
    default: false,
    type: Boolean,
  });

  const colorList = [
    { name: "默认", color: "#409eff" },
    { name: "紫罗兰", color: "#7166f0" },
    { name: "樱花粉", color: "#e84a6c" },
    { name: "柠檬黄", color: "#efbd48" },
    { name: "天蓝色", color: "#4e69fd" },
    { name: "浅绿色", color: "#0bd092" },
    { name: "锌色灰", color: "#3f3f46" },
    { name: "橙黄色", color: "#c1420b" },
    { name: "玫瑰红", color: "#bb1b1b" },
  ];

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
  .color_list {
    padding: 10px 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;

    .color_item {
      cursor: pointer;
      height: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      border: 1px solid #e2e8f0;
      border-radius: 5px;

      .color_name {
        font-size: 12px;
        font-weight: normal;
        color: #fff;
      }
    }
  }
</style>
