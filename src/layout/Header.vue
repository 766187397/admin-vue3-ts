<template>
  <div class="header">
    <div class="navbar">
      <div class="left">
        <div class="is_collapse" @click="handleCollapse">
          <el-icon size="20" v-if="isCollapse"><Expand /></el-icon>
          <el-icon size="20" v-else><Fold /></el-icon>
        </div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in matched" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="right">
        <div class="r_item">
          <el-icon @click="drawer = true"><Setting /></el-icon>
        </div>
        <div class="r_item">
          <el-switch
            v-model="theme"
            style="--el-switch-on-color: #2c2c2c; --el-switch-off-color: #f2f2f2"
            active-action-icon="Moon"
            inactive-action-icon="Sunny"
            @click="handleAnimation($event)" />
        </div>
        <div class="r_item">
          <el-icon size="20" @click="enterFullScreen" v-if="!fullScreenState"><FullScreen /></el-icon>
          <el-icon size="20" @click="exitFullscreen" v-else><CopyDocument /></el-icon>
        </div>
        <div class="r_item">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar v-if="userInfo.avatar" shape="square" size="default" :src="userInfo.avatar" />
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
            @click="handleClickTags(tag)">
            {{ tag.name }}
          </el-tag>
        </div>
      </Contextmenu>
    </div>
    <!--  :before-close="handleClose" -->
    <el-drawer v-model="drawer" title="偏好设置" direction="rtl" size="380px" @open="handleOpen">
      <template #default>
        <el-form :model="config" label-width="auto">
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
  </div>
</template>

<script setup lang="ts">
  import { useRouter, useRoute } from "vue-router";
  import { useUserInfoStore, useMenuStore, usePublicStore, useElConfigStore } from "@/store";
  import Contextmenu from "@/components/public/Contextmenu.vue";
  const router = useRouter();
  const rouet = useRoute();
  const publicStore = usePublicStore();
  const menuStore = useMenuStore();
  const userInfoStore = useUserInfoStore();
  const elConfigStore = useElConfigStore();
  // 获取用户信息
  const userInfo = computed(() => userInfoStore.userInfo);
  // 偏好设置开关
  const drawer = ref<boolean>(false);
  let restored = {};
  const config = computed(() => elConfigStore.config);
  const handleOpen = () => {
    restored = { ...elConfigStore.config };
  };
  const handleCancel = () => {
    ElMessageBox.confirm("取消会将丢失已修改的设置", "提示")
      .then(() => {
        drawer.value = false;
        elConfigStore.setConfig(restored);
      })
  };
  // 菜单是否折叠
  const isCollapse = computed(() => {
    return menuStore.isCollapse;
  });
  const matched = ref();
  matched.value = rouet.matched.filter((item) => item.name !== "layout" && item.name !== "home");
  // 控制折叠
  const handleCollapse = () => {
    menuStore.setIsCollapse(!isCollapse.value);
  };
  // 退出登录
  const { handleLogout } = userInfoStore;
  const { enterFullScreen, exitFullscreen, getFullScreenState, handleAnimation } = publicStore;
  getFullScreenState();
  const fullScreenState = computed(() => publicStore.fullScreen);

  // 主题
  const theme = computed(() => publicStore.theme);

  import type { TagProps } from "element-plus";

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
          cursor: pointer;

          :deep(.el-switch) {
            .el-icon {
              color: #000;
            }
          }
        }
      }
    }
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
  }
</style>
