<template>
  <div class="header">
    <div class="navbar">
      <div class="left">
        <div class="is_collapse" @click="handleCollapse">
          <el-icon size="20" v-if="isCollapse">
            <Expand />
          </el-icon>
          <el-icon size="20" v-else>
            <Fold />
          </el-icon>
        </div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in matched" :key="item.path">{{
            item.meta.title
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="right">
        <div class="r_item">
          <el-dropdown>
            <el-icon size="20">
              <i class="iconfont icon-github"></i>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-link href="https://github.com/766187397/nest-serve" target="_blank"
                    >后端：Github</el-link
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link href="https://gitee.com/sk20020228/nest-serve" target="_blank"
                    >后端：Gitee</el-link
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link href="https://github.com/766187397/admin-vue3-ts" target="_blank"
                    >前端：Github</el-link
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link href="https://gitee.com/sk20020228/admin-vue3-ts" target="_blank"
                    >前端：Gitee</el-link
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="r_item">
          <el-icon size="20" @click="drawer = true">
            <Setting />
          </el-icon>
        </div>
        <div class="r_item" ref="switch">
          <el-switch
            v-model="config.darkTheme"
            style="--el-switch-on-color: #2c2c2c; --el-switch-off-color: #f2f2f2"
            active-action-icon="Moon"
            inactive-action-icon="Sunny"
            @click="handleAnimation($event)" />
        </div>
        <div class="r_item">
          <el-icon size="20" @click="enterFullScreen" v-if="!fullScreenState">
            <FullScreen />
          </el-icon>
          <el-icon size="20" @click="exitFullscreen" v-else>
            <CopyDocument />
          </el-icon>
        </div>
        <div class="r_item">
          <Notice />
        </div>
        <div class="r_item">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar
                v-if="userInfo.avatar"
                shape="square"
                size="default"
                :src="userInfo.avatar"
                :title="userInfo.nickName" />
              <span v-else>{{ userInfo.nickName }}</span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <Tags />
    <Drawer v-model:drawer="drawer" />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useUserInfoStore, useMenuStore, usePublicStore, useElConfigStore } from "@/store";
import Drawer from "./components/Drawer.vue";
import Notice from "./components/Notice.vue";
import Tags from "./components/Tags.vue";

const rouet = useRoute();
const publicStore = usePublicStore();
const menuStore = useMenuStore();
const userInfoStore = useUserInfoStore();
const elConfigStore = useElConfigStore();

const { handleAnimation, changeThemeColor } = elConfigStore;

// 获取用户信息
const userInfo = computed(() => userInfoStore.userInfo);
// 偏好设置开关
const drawer = ref<boolean>(false);

// 菜单是否折叠
const isCollapse = computed(() => {
  return menuStore.isCollapse;
});
const matched = ref();
matched.value = rouet.matched.filter((item) => item.name !== "layout" && item.name !== "home");
watch(
  () => rouet.matched,
  (newValue, oldValue) => {
    matched.value = newValue.filter((item) => item.name !== "layout" && item.name !== "home");
  }
);
// 控制折叠
const handleCollapse = () => {
  menuStore.setIsCollapse(!isCollapse.value);
};
// 退出登录
const { handleLogout } = userInfoStore;
const { enterFullScreen, exitFullscreen, getFullScreenState } = publicStore;

const fullScreenState = computed(() => publicStore.fullScreen);

// 主题
const config = computed(() => elConfigStore.config);
const switchDom = useTemplateRef<Element>("switch");
// 加载默认值
const LoadDefaultConfig = () => {
  if (config.value.darkTheme) {
    let { left, top } = switchDom.value?.getBoundingClientRect() as DOMRect;
    handleAnimation({ clientX: left, clientY: top });
  } else {
    changeThemeColor(config.value.themeColor);
  }
};

onMounted(() => {
  LoadDefaultConfig();
  document.addEventListener("fullscreenchange", getFullScreenState);
});
</script>

<style lang="scss" scoped>
.header {
  padding: 15px 0;
  box-sizing: border-box;

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      gap: 20px;

      .is_collapse {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;

      .r_item {
        display: flex;
        align-items: center;
        height: 42px;
        .iconfont {
          cursor: pointer;
          font-size: 24px;
        }
        .el-icon {
          cursor: pointer;
        }
        .el-dropdown-link {
          display: flex;
          align-items: center;
        }

        :deep(.el-switch) {
          .el-icon {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
