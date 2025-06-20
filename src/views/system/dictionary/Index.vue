<template>
  <div class="page" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="字典名称：">
              <el-input v-model="query.name" placeholder="请输入字典名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间范围：">
              <el-date-picker
                v-model="time"
                type="datetimerange"
                :default-time="defaultTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" plain @click="getTableData(true)">查询</el-button>
            <el-button plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <div class="table_menu">
        <el-row :gutter="20" justify="end">
          <el-col :span="1">
            <el-button type="primary" plain @click="handleRow('add')">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="name" label="字典名称" align="center" />
        <el-table-column prop="type" label="字典类型" align="center">
          <template v-slot="scope">
            <div class="row">
              <span class="dictionary_type">{{ scope.row.type }}</span>
              <span class="icon_copy" @click="copyTextToClipboard(scope.row.type)">
                <el-icon size="16"><CopyDocument /></el-icon>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="字典描述" align="center" />
        <el-table-column prop="createdAt" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" fixed="right" width="300">
          <template v-slot="scope">
            <el-button type="primary" text plain @click="handleRow('edit', scope.row.id)">编辑</el-button>
            <el-button type="danger" text plain @click="handleRow('delete', scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Pagination
      v-model:pageSize="query.pageSize"
      v-model:page="query.page"
      v-model:total="total"
      @size-change="getTableData(true)"
      @current-change="getTableData(false)" />

    <el-drawer v-model="drawerVisible" direction="rtl">
      <template #header>
        <h4>{{ title }}</h4>
      </template>
      <template #default v-if="form">
        <el-form ref="formRef" :model="form" label-width="auto">
          <el-form-item label="Activity name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button>取消</el-button>
          <el-button type="primary">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  import Pagination from "@/components/el/Pagination.vue";
  import { ElMessage } from "element-plus";
  import type { HandleRowType } from "@/types/public";
  import {
    createDictionary,
    deleteDictionary,
    getDictionaryDetail,
    getDictionaryPage,
    updateDictionary,
  } from "@/api/dictionary";
  import type { DictionaryDetail, GetDictionaryPageParams } from "@/types/dictionary";
  import { copyTextToClipboard } from "@/utils/tool";

  const now = new Date();
  const defaultTime: [Date, Date] = [
    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
  ];

  // 加载中动画
  const loading = ref(false);
  const buttonLoading = ref(false);
  // 弹窗状态
  const drawerVisible = ref(false);
  // 弹窗名称
  const title = ref("");
  // 默认查询条件
  const defaultQuery = {
    page: 1,
    pageSize: 10,
    name: "",
    time: "",
  };
  // 时间
  const time = ref<[Date, Date]>();
  // 总条数
  const total = ref(0);
  // 查询条件
  const query = ref<GetDictionaryPageParams>({
    ...defaultQuery,
  });
  /** 重置 */
  const handleReset = () => {
    query.value = { ...defaultQuery };
    time.value = undefined;
  };

  /** 数据 */
  const tableData = ref<DictionaryDetail[]>();

  /** 查询数据 */
  const getTableData = async (type: boolean = false) => {
    if (type) {
      query.value.page = 1;
    }
    loading.value = true;
    let data = { ...query.value };
    if (time.value && time.value.length > 0) {
      data.time = time.value.join(",");
    }
    const res = await getDictionaryPage(data);
    total.value = res.data.total;
    tableData.value = res.data.data;
    loading.value = false;
  };
  getTableData();

  // 表单数据
  const form = ref();
  const rules = ref({});

  /** 行操作 */
  const handleRow = async (type: HandleRowType, id?: string) => {
    try {
      loading.value = true;
      const fns = {
        getDetail: async function () {
          let res = await getDictionaryDetail(id as string);
          form.value = res.data;
        },
        edit: async function () {
          drawerVisible.value = true;
          await fns.getDetail();
          title.value = "编辑";
        },
        add: async function () {
          drawerVisible.value = true;
          title.value = "新增";
          form.value = {};
        },
        detail: async function () {
          drawerVisible.value = true;
          await fns.getDetail();
          title.value = "详情";
        },
        delete: async function () {
          ElMessageBox.confirm("你确定要删除吗？", "删除路由", {
            type: "error",
          }).then(async () => {
            let res = await deleteDictionary(id as string);
            getTableData();
            ElMessage.success({
              message: res?.message || "操作成功",
            });
          });
        },
      };
      await fns[type]();
    } finally {
      loading.value = false;
    }
  };

  /** 表单 */
  const formRef = useTemplateRef("formRef");

  /** 提交 */
  const submit = () => {
    formRef.value?.validate(async (valid) => {
      if (!valid) return;
      try {
        buttonLoading.value = true;
        let res;
        // 调用接口
        if ("id" in form.value!) {
          // 编辑
          res = await updateDictionary(form.value?.id, form.value);
        } else {
          // 新增
          res = await createDictionary(form.value);
        }
        drawerVisible.value = false;
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

<style lang="scss" scoped>
  .table {
    .row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      .icon_copy {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
