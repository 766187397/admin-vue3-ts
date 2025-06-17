<template>
  <div class="page" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="账号：">
              <el-input v-model="query.account" placeholder="请输入账号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="昵称：">
              <el-input v-model="query.nickName" placeholder="请输入昵称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="邮箱：">
              <el-input v-model="query.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="手机号：">
              <el-input v-model="query.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间范围：">
              <el-date-picker
                v-model="query.time"
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
            <el-button type="primary" plain>添加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="account" label="账号" align="center" />
        <el-table-column prop="nickName" label="昵称" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="sex" label="性别" align="center" />
        <el-table-column prop="avatar" label="头像" align="center" />
        <el-table-column label="操作" align="center" fixed="right" width="300">
          <template v-slot="scope">
            <el-button type="primary" text plain @click="handleRow('edit', scope.row.id)">编辑</el-button>
            <el-button type="primary" text plain @click="handleRow('add')">新增</el-button>
            <el-button type="danger" text plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Pagination
      v-model:pageSize="query.pageSize"
      v-model:page="query.page"
      v-model:total="query.total"
      @size-change="getTableData(true)"
      @current-change="getTableData(false)" />

    <el-dialog v-model="dialogVisible" :title="title" width="980" :before-close="handleClose">
      <div class="dialog" v-if="form">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="上级路由："> </el-form-item>
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
  import { getUserInfo, getUsersPageAdmin } from "@/api/user";
  import Pagination from "@/components/el/Pagination.vue";
  import type { HandleRowType } from "@/types/public";
  import type { UserResponseData, UsersCreateParams, UsersQueryParams } from "@/types/user";
  import { ElMessage } from "element-plus";
  const now = new Date();
  const defaultTime: [Date, Date] = [
    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
  ];

  // 加载中动画
  const loading = ref(false);
  const buttonLoading = ref(false);
  // 弹窗状态
  const dialogVisible = ref(false);
  // 弹窗名称
  const title = ref("");
  // 默认查询条件
  const defaultQuery = {
    page: 1,
    pageSize: 1,
    total: 0,
    account: "",
    nickName: "",
    email: "",
    phone: "",
  };
  // 查询条件
  const query = ref<UsersQueryParams>({
    ...defaultQuery,
  });
  /** 重置 */
  const handleReset = () => {
    query.value = { ...defaultQuery };
  };
  /** 数据 */
  const tableData = ref<UserResponseData[]>();

  /** 查询数据 */
  const getTableData = async (type: boolean = false) => {
    if (type) {
      query.value.page = 1;
    }
    loading.value = true;
    let data = { ...query.value };
    const res = await getUsersPageAdmin(data);
    query.value.total = res.data.total;
    tableData.value = res.data.data;
    loading.value = false;
  };
  getTableData();

  // 表单数据
  const form = ref<UserResponseData | UsersCreateParams>();
  const rules = ref();

  // 关闭弹窗
  const handleClose = () => {
    form.value = undefined;
    dialogVisible.value = false;
  };

  const formRef = useTemplateRef("formRef");

  /** 提交 */
  const submit = () => {
    formRef.value?.validate(async (valid) => {
      if (!valid) return;
      try {
        buttonLoading.value = true;
        let res;
        // 调用接口
        dialogVisible.value = false;
        ElMessage.success({
          // message: res?.message || "操作成功",
        });
        getTableData();
      } catch (error) {
      } finally {
        buttonLoading.value = false;
      }
    });
  };

  // 行操作
  const handleRow = async (type: HandleRowType, id?: string) => {
    try {
      loading.value = true;
      dialogVisible.value = true;
      const fns = {
        getDetail: async function () {
          let res = await getUserInfo(id as string);
          form.value = res.data;
        },
        edit: async function () {
          await fns.getDetail();
          title.value = "编辑";
        },
        add: async function () {
          title.value = "新增";
          form.value = {
            sort: 1,
            status: 1,
            email: "",
            phone: "",
            sex: "0",
            avatar: "",
            roleIds: [],
            account: "",
            nickName: "",
            password: "",
          } as UsersCreateParams;
        },
        detail: async function () {
          await fns.getDetail();
          title.value = "详情";
        },
      };
      // 直接调用不影响this的指向，否则使用bind(this)
      // const fn = fns[type];
      // await fn.bind(fns)();
      await fns[type]();
    } finally {
      loading.value = false;
    }
  };
</script>

<style lang="scss" scoped></style>
