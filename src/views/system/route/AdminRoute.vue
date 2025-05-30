<template>
  <div class="admin_route" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="平台：">
              <el-input v-model="query.platform" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="类型：">
              <el-input v-model="query.type" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" size="small" plain @click="handleAdd">添加</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table :data="tableData" row-key="id" default-expand-all>
      <el-table-column prop="title" label="名称" align="left" />
      <el-table-column prop="name" label="路由名称" align="center" />
      <el-table-column prop="icon" label="图标" align="center" />
      <el-table-column prop="type" label="类型" align="center" />
      <!-- <el-table-column prop="createdAt" label="创建时间" align="center" /> -->
      <el-table-column prop="externalLinks" label="是否为外链" align="center" />
      <el-table-column prop="path" label="路由" align="center" />
      <el-table-column prop="redirect" label="重定向" align="center" />
      <el-table-column prop="component" label="组件" align="center" />
      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template v-slot="scope">
          <el-button type="primary" size="small" @click="getInfo(scope.row.id)" plain>编辑</el-button>
          <el-button type="primary" size="small" @click="getInfo(scope.row.id)" plain>编辑</el-button>
          <el-button type="danger" size="small" @click="getInfo(scope.row.id)" plain>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="title" width="980" :before-close="handleClose">
      <div class="dialog" v-if="form">
        <el-form ref="formRef" :model="form" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="上级路由：">
                <el-cascader
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
                <el-input v-model="form.icon" placeholder="请输入图标(element组件/进入的图标class)" />
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
  import { createRoute, getRoutesAll, getRoutesDetail, updateRoutes } from "@/api/menu";
  import type { createRoutesParams, RouterInfo } from "@/types/menu";
  import { ElMessage } from "element-plus";

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

  // 表格数据
  const tableData = ref<RouterInfo[]>([]);

  // 查询表格数据
  const getTableData = async () => {
    try {
      loading.value = true;
      let res = await getRoutesAll(query.value);
      tableData.value = res.data;
    } catch (error) {
    } finally {
      loading.value = false;
    }
  };
  getTableData();

  // 表单数据
  const form = ref<RouterInfo | createRoutesParams>();
  // 查询详情
  const getInfo = async (id: string) => {
    try {
      loading.value = true;
      let res = await getRoutesDetail(id);
      form.value = res.data;
      dialogVisible.value = true;
      title.value = "编辑";
    } catch (error) {
    } finally {
      loading.value = false;
    }
  };

  // 关闭弹窗
  const handleClose = () => {
    form.value = undefined;
    dialogVisible.value = false;
  };

  const handleAdd = () => {
    dialogVisible.value = true;
    title.value = "添加";
    form.value = {
      platform: "admin",
      type: "menu",
      title: "",
      name: "",
      path: "",
      component: "",
      icon: "",
      externalLinks: false,
      redirect: "",
      sort: 1,
      meta: "",
    };
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
</script>

<style lang="scss" scoped></style>
