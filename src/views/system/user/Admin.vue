<template>
  <div class="page" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="账号：">
              <el-input v-model="query.account" placeholder="请输入账号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="昵称：">
              <el-input v-model="query.nickName" placeholder="请输入昵称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="邮箱：">
              <el-input v-model="query.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="手机号：">
              <el-input v-model="query.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="8" :md="12" :sm="24" :xs="24">
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
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-button type="primary" plain @click="getTableData(true)">查询</el-button>
            <el-button plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <div class="table_menu">
        <el-row :gutter="20" justify="end">
          <el-button type="primary" plain @click="handleExport">导出为 Excel</el-button>
          <el-button type="primary" plain @click="handleRow('add')">添加</el-button>
        </el-row>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="account" label="账号" align="center" />
        <el-table-column prop="nickName" label="昵称" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="sex" label="性别" align="center">
          <template v-slot="scope"> {{ displayValue(sexOptions, scope.row.sex) }} </template>
        </el-table-column>
        <el-table-column prop="avatar" label="头像" align="center" width="120">
          <template v-slot="scope">
            <el-image
              style="max-width: 100px; max-height: 100px"
              :src="scope.row.avatar"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[scope.row.avatar]"
              show-progress
              preview-teleported
              fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" align="center" width="200" />
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
              <el-form-item label="账号：" prop="account">
                <el-input v-model="form.account" placeholder="请输入账号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码：" prop="password">
                <el-input
                  v-model="form.password"
                  type="password"
                  show-password
                  placeholder="请输入密码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="昵称：" prop="nickName">
                <el-input v-model="form.nickName" placeholder="请输入昵称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱：">
                <el-input v-model="form.email" type="email" placeholder="请输入邮箱" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号：">
                <el-input v-model="form.phone" placeholder="请输入手机号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别：">
                <el-select v-model="form.sex" placeholder="请选择性别">
                  <el-option
                    v-for="item in sexOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="头像：">
                <PictureUpload v-model:imageUrl="form.avatar" @updateSuccess="handlePictureUploadSuccess" />
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
import PictureUpload from "@/components/el/PictureUpload.vue";
import Pagination from "@/components/el/Pagination.vue";
import { ElMessage, type FormInstance } from "element-plus";
import { getDictionaryItemAll } from "@/api/public";
import {
  getUserInfo,
  updateUser,
  deleteUser,
  getUsersPageAdmin,
  createUserAdmin,
  getUsersExcelAdmin,
} from "@/api/user";
import { displayValue } from "@/hooks/dictionary";
import type { HandleRowType } from "@/types/public";
import type { UserResponseData, UsersCreateParams, UsersQueryParams, UsersUpdateParams } from "@/types/user";

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
  account: "",
  nickName: "",
  email: "",
  phone: "",
  time: "",
};
// 时间
const time = ref();
// 总条数
const total = ref(0);
// 查询条件
const query = ref<UsersQueryParams>({
  ...defaultQuery,
});
/** 重置 */
const handleReset = () => {
  query.value = { ...defaultQuery };
  time.value = undefined;
};

const sexOptions = ref();
const getUserSex = async () => {
  let res = await getDictionaryItemAll({ type: "userSex" });
  sexOptions.value = res.data;
};
getUserSex();

/** 数据 */
const tableData = ref<UserResponseData[]>();

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
  const res = await getUsersPageAdmin(data);
  total.value = res.data.total;
  tableData.value = res.data.data;
  loading.value = false;
};
getTableData();

// 文件上传成功
const handlePictureUploadSuccess = (res: any, file: any) => {
  if (form.value) {
    form.value.avatar = res.data.completePath;
  }
};

// 表单数据
const form = ref<UsersCreateParams | UsersUpdateParams | UserResponseData>();
const rules = ref({
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
});

// 关闭弹窗
const handleClose = () => {
  form.value = undefined;
  dialogVisible.value = false;
};

const formRef = useTemplateRef<FormInstance>("formRef");

/** 行操作 */
const handleRow = async (type: HandleRowType, id?: string) => {
  try {
    loading.value = true;
    const fns = {
      getDetail: async function () {
        let res = await getUserInfo(id as string);
        form.value = res.data;
      },
      edit: async function () {
        dialogVisible.value = true;
        rules.value.password = [{ required: false, message: "请输入密码", trigger: "blur" }];
        await fns.getDetail();
        title.value = "编辑";
      },
      add: async function () {
        dialogVisible.value = true;
        rules.value.password = [{ required: true, message: "请输入密码", trigger: "blur" }];
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
        };
      },
      detail: async function () {
        dialogVisible.value = true;
        await fns.getDetail();
        title.value = "详情";
      },
      delete: async function () {
        ElMessageBox.confirm("你确定要删除吗？", "删除路由", {
          type: "error",
        }).then(async () => {
          let res = await deleteUser(id as string);
          getTableData();
          ElMessage.success({
            message: res?.message || "操作成功",
          });
        });
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

/** 导出为Excel */
const handleExport = async () => {
  await getUsersExcelAdmin(query.value as UsersQueryParams);
};

/** 提交 */
const submit = () => {
  if (!formRef.value) return;
  formRef.value?.validate(async (valid) => {
    if (!valid) return;
    try {
      buttonLoading.value = true;
      let res;
      // 调用接口
      if ("id" in form.value!) {
        // 编辑
        res = await updateUser(form.value?.id, form.value as UsersUpdateParams);
      } else {
        // 新增
        res = await createUserAdmin(form.value as UsersCreateParams);
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
