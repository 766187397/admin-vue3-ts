<template>
  <div class="page" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="标题：">
              <el-input v-model="query.title" placeholder="请输入标题"></el-input>
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
        <el-table-column prop="title" label="标题" align="center" />
        <el-table-column prop="type" label="类型" align="center" />
        <el-table-column prop="specifyTime" label="预发布时间" align="center" />
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

    <el-dialog v-model="dialogVisible" :title="title" width="980" :before-close="handleClose">
      <div class="dialog" v-if="form">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="标题：">
                <el-input v-model="form.title" placeholder="请输入标题" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型：">
                <el-input v-model="form.type" placeholder="请输入类型" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="状态：">
                <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="排序：">
                <el-input-number v-model="form.sort" :min="1" controls-position="right" />
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
  import Pagination from "@/components/el/Pagination.vue";
  import { ElMessage } from "element-plus";
  import type { HandleRowType } from "@/types/public";
  import { createNoticeWeb, getNoticePageWeb, deleteNotice, getNoticeDetail, updateNotice } from "@/api/notice";
  import type { CreateNoticeParams, NoticeDetail, UpdateNoticeParams, GetNoticeParams } from "@/types/notice";
  import { getRolesAllAdmin, getRolesAllWeb } from "@/api/role";
  import type { RoleDetail } from "@/types/role";
  import { getUsersAdmin, getUsersWeb } from "@/api/user";
  import type { UserResponseData } from "@/types/user";

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
    pageSize: 10,
    name: "",
    time: "",
  };
  // 时间
  const time = ref<[Date, Date]>();
  // 总条数
  const total = ref(0);
  // 查询条件
  const query = ref<GetNoticeParams>({
    ...defaultQuery,
  });
  /** 重置 */
  const handleReset = () => {
    query.value = { ...defaultQuery };
    time.value = undefined;
  };

  const adminRoles = ref<RoleDetail[]>();
  const webRoles = ref<RoleDetail[]>();
  /** 查询角色 */
  const getRolesAll = async () => {
    let adminRes = await getRolesAllAdmin();
    adminRoles.value = adminRes.data;
    let webRes = await getRolesAllWeb();
    webRoles.value = webRes.data;
  };
  getRolesAll();

  const adminUsers = ref<UserResponseData[]>();
  const webUsers = ref<UserResponseData[]>();
  const getUsersAll = async () => {
    let adminRes = await getUsersAdmin();
    adminUsers.value = adminRes.data;
    let webRes = await getUsersWeb();
    webUsers.value = webRes.data;
  };
  getUsersAll();

  /** 数据 */
  const tableData = ref<NoticeDetail[]>();

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
    const res = await getNoticePageWeb(data);
    total.value = res.data.total;
    tableData.value = res.data.data;
    loading.value = false;
  };
  getTableData();

  // 表单数据
  const form = ref<CreateNoticeParams | UpdateNoticeParams | NoticeDetail>();
  const rules = ref({});

  /** 行操作 */
  const handleRow = async (type: HandleRowType, id?: string) => {
    try {
      loading.value = true;
      const fns = {
        getDetail: async function () {
          let res = await getNoticeDetail(id as string);
          form.value = res.data;
        },
        edit: async function () {
          dialogVisible.value = true;
          await fns.getDetail();
          title.value = "编辑";
        },
        add: async function () {
          dialogVisible.value = true;
          title.value = "新增";
          form.value = {};
        },
        detail: async function () {
          dialogVisible.value = true;
          await fns.getDetail();
          title.value = "详情";
        },
        delete: async function () {
          ElMessageBox.confirm("删除字典会连同当前字典绑定的所有数据一起删除，你确定要删除吗？", "删除字典", {
            type: "error",
          }).then(async () => {
            let res = await deleteNotice(id as string);
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

  // 关闭弹窗
  const handleClose = () => {
    form.value = undefined;
    dialogVisible.value = false;
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
          res = await updateNotice(form.value?.id, form.value);
        } else {
          // 新增
          res = await createNoticeWeb(form.value as CreateNoticeParams);
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
