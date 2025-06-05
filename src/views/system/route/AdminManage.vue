<template>
  <div class="page" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" plain @click="handleForm('add')">添加</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table :data="tableData" row-key="id" default-expand-all>
      <el-table-column prop="title" label="名称" align="left" />
      <el-table-column prop="name" label="路由名称" align="center" width="100" />
      <el-table-column prop="icon" label="图标" align="center" width="200" />
      <el-table-column prop="type" label="类型" align="center" width="100">
        <template v-slot="scope">
          <span>{{ typeValue(typeList, scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="externalLinks" label="是否为外链" align="center" width="100" />
      <el-table-column prop="path" label="路由" align="center" />
      <el-table-column prop="redirect" label="重定向" align="center">
        <template v-slot="scope">
          <el-link type="primary" target="_blank" :href="scope.row.redirect">{{ scope.row.redirect }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="组件" align="center" />
      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template v-slot="scope">
          <el-button type="primary" text plain @click="handleForm('edit', scope.row.id)">编辑</el-button>
          <el-button type="primary" text plain @click="handleForm('add', scope.row.id)">新增</el-button>
          <el-button type="danger" text plain @click="handleDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="title" width="980" :before-close="handleClose">
      <div class="dialog" v-if="form">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="上级路由：">
                <el-cascader
                  v-model="form.parentId"
                  :options="tableData"
                  :props="{ value: 'id', label: 'title', checkStrictly: true }"
                  filterable
                  clearable
                  style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="路由类型：">
                <el-select v-model="form.type" placeholder="请选择路由路由类型">
                  <el-option label="目录" value="catalogue" />
                  <el-option label="菜单" value="menu" />
                  <el-option label="按钮" value="button" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称：">
                <el-input v-model="form.title" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="路由名称：">
                <el-input v-model="form.name" placeholder="请输入路由名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="路由路径：">
                <el-input v-model="form.path" placeholder="请输入路由路径" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="页面组件：">
                <el-input v-model="form.component" placeholder="请输入页面组件(@/views/***/***.vue)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标：">
                <el-select
                  v-model="form.icon"
                  placeholder="请输入图标(element组件/进入的图标class)"
                  clearable
                  filterable>
                  <el-option-group v-for="group in componentAndIcons" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item" :label="item" :value="item">
                      <div class="icon_list">
                        <span class="left">{{ item }}</span>
                        <span class="right">
                          <el-icon v-if="elementPlusIcons.includes(item)">
                            <component :is="item" />
                          </el-icon>
                          <i v-else class="customize_icon" :class="item"></i>
                        </span>
                      </div>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否为外链：">
                <el-switch v-model="form.externalLinks" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重定向地址：">
                <el-input v-model="form.redirect" placeholder="请输入重定向地址" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序：">
                <el-input-number v-model="form.sort" :min="1" controls-position="right" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="其他JSON数据：">
                <el-input
                  v-model="form.meta"
                  :autosize="{ minRows: 3, maxRows: 9 }"
                  type="textarea"
                  placeholder="需要按照JSON格式填写(不要和现有的固定值相同)" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { createRoute, delRoutes, getRoutesAll, getRoutesDetail, updateRoutes } from "@/api/menu";
  import type { createRoutesParams, RouterInfoList } from "@/types/menu";
  import { ElMessage, ElMessageBox, type FormRules } from "element-plus";
  import { getDictionaryItemAll } from "@/api/public";
  import { typeValue } from "@/utils/tool";
  import type { getDictionaryItemAllResult, typeObj } from "@/types/public";
  import * as ElementPlusIconsVue from "@element-plus/icons-vue";
  import { baseIconsList } from "@/assets/icon/index";

  const elementPlusIcons = Object.keys(ElementPlusIconsVue);

  const componentAndIcons = reactive<any>([
    {
      label: "Element Plus Icons",
      options: [...elementPlusIcons],
    },
    {
      label: "Customize Icons",
      options: [...baseIconsList],
    },
  ]);
  // 加载中动画
  const loading = ref(false);
  const buttonLoading = ref(false);
  // 弹窗状态
  const dialogVisible = ref(false);
  // 弹窗名称
  const title = ref("");
  // 查询条件
  const query = ref({
    platform: "admin",
    type: "",
  });

  // 查询类型
  const typeList = ref<getDictionaryItemAllResult[]>();
  const getDictionaryItemAllAsync = async () => {
    let res = await getDictionaryItemAll({ type: "routeType" });
    typeList.value = res.data;
  };
  getDictionaryItemAllAsync();

  // 表格数据
  const tableData = ref<RouterInfoList[]>([]);

  // 查询表格数据
  const getTableData = async () => {
    try {
      loading.value = true;
      const data = {
        ...query.value,
      };
      let res = await getRoutesAll(data);
      tableData.value = res.data;
    } catch (error) {
    } finally {
      loading.value = false;
    }
  };
  getTableData();

  // 表单数据
  const form = ref<RouterInfoList | createRoutesParams>();

  // 表单校验
  const rules = reactive<FormRules<RouterInfoList>>({
    type: [{ required: true, message: "请选择路由类型", trigger: ["blur", "change"] }],
    name: [{ required: true, message: "请输入路由名称", trigger: ["blur", "change"] }],
    title: [{ required: true, message: "请输入路由显示名称", trigger: ["blur", "change"] }],
    path: [{ required: true, message: "请输入前端路由路径", trigger: ["blur", "change"] }],
  });

  // 查询详情
  const handleForm = async (type: typeObj, id?: string | number) => {
    try {
      loading.value = true;
      dialogVisible.value = true;
      const typeObj = {
        getDetail: async function () {
          let res = await getRoutesDetail(id as string);
          form.value = res.data;
        },
        edit: async function () {
          await typeObj.getDetail();
          title.value = "编辑";
        },
        add: async function () {
          title.value = "新增";
          form.value = {
            sort: 0,
            status: 1,
            component: "",
            meta: "",
            icon: "",
            parentId: id as number,
            externalLinks: false,
            redirect: "",
            type: "",
            name: "",
            title: "",
            path: "",
            platform: query.value.platform,
          } as createRoutesParams;
        },
        detail: async function () {
          await typeObj.getDetail();
          title.value = "详情";
        },
      };
      // 直接调用不影响this的指向，否则使用bind(this)
      // const fn = typeObj[type];
      // await fn.bind(typeObj)();
      await typeObj[type]();
    } finally {
      loading.value = false;
    }
  };

  // 关闭弹窗
  const handleClose = () => {
    form.value = undefined;
    dialogVisible.value = false;
  };

  const formRef = useTemplateRef("formRef");
  // 提交
  const submit = () => {
    formRef.value?.validate(async (valid) => {
      if (!valid) return;
      try {
        buttonLoading.value = true;
        let res;
        if ("id" in form.value!) {
          // 编辑
          res = await updateRoutes(form.value?.id, form.value as createRoutesParams);
        } else {
          // 新增
          res = await createRoute(form.value as createRoutesParams);
        }
        dialogVisible.value = false;
        ElMessage.success({
          message: res?.message || "操作成功",
        });
        getTableData();
      } catch (error) {
      } finally {
        buttonLoading.value = false;
      }
    });
  };

  /** 删除 */
  const handleDel = (id: string | number) => {
    ElMessageBox.confirm("你确定要删除吗？", "删除路由", {
      type: "error",
    }).then(async () => {
      let res = await delRoutes(id);
      getTableData();
      ElMessage.success({
        message: res?.message || "操作成功",
      });
    });
  };
</script>

<style lang="scss" scoped>
  .icon_list {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  :deep(.el-link) {
    width: 100%;
    .el-link__inner {
      width: 100%;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
