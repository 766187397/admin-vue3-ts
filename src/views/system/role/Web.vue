<template>
  <div class="page" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="角色名称：">
              <el-input v-model="query.name" placeholder="请输入角色名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="角色标识：">
              <el-input v-model="query.roleKey" placeholder="请输入角色标识" clearable></el-input>
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
                end-placeholder="结束日期"
                clearable
              />
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
          <el-col :span="1.5">
            <el-button type="primary" plain @click="handleRow('add')">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column prop="roleKey" label="标识" align="center" />
        <el-table-column prop="description" label="描述" align="center" />
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
      @current-change="getTableData(false)"
    />

    <el-dialog v-model="dialogVisible" :title="title" width="980" :before-close="handleClose">
      <div class="dialog" v-if="form">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="角色名称：" prop="name">
                <el-input v-model="form.name" placeholder="请输入角色名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色标识：" prop="roleKey">
                <el-input v-model="form.roleKey" placeholder="请输入角色标识" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色描述：" prop="description">
                <el-input
                  :rows="2"
                  type="textarea"
                  v-model="form.description"
                  placeholder="请输入角色描述"
                  clearable
                ></el-input>
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
            <el-col :span="24">
              <el-form-item label="路由：">
                <el-tree
                  :data="router"
                  show-checkbox
                  node-key="id"
                  :default-checked-keys="defaultCheckedKeys"
                  :props="{
                    label: 'title',
                    children: 'children',
                  }"
                  @check="handleCheckChange"
                />
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
import { ElMessage, type FormInstance } from "element-plus";
import { createRoleWeb, deleteRole, getRoleDetail, getRolesByRoleWeb, updateRole } from "@/api/role";
import type { HandleRowType } from "@/types/public";
import type { RoleCreateParams, RoleDetail, RoleQueryParams, RoleUpdateParams } from "@/types/role";
import { getRoutesAllAdmin } from "@/api/menu";

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
  roleKey: "",
  time: "",
};
// 时间
const time = ref();
// 总条数
const total = ref(0);
// 查询条件
const query = ref<RoleQueryParams>({
  ...defaultQuery,
});
/** 重置 */
const handleReset = () => {
  query.value = { ...defaultQuery };
  time.value = undefined;
};

/** 路由 */
const router = ref();

/** 默认数据 */
const defaultCheckedKeys = ref([]);

/** 获取路由 */
const getRoutesAll = async () => {
  const res = await getRoutesAllAdmin();
  router.value = res.data;
};
getRoutesAll();

/** 勾选 */
const handleCheckChange = (node: any, data: any) => {
  if (form.value) {
    form.value.routeIds = data.checkedKeys;
  }
};

/** 数据 */
const tableData = ref<RoleDetail[]>();

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
  const res = await getRolesByRoleWeb(data);
  total.value = res.data.total;
  tableData.value = res.data.data;
  loading.value = false;
};
getTableData();

// 表单数据
const form = ref<RoleCreateParams | RoleUpdateParams | RoleDetail>();
const rules = ref({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  roleKey: [{ required: true, message: "请输入标识", trigger: "blur" }],
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
        let res = await getRoleDetail(id as string);
        defaultCheckedKeys.value = res.data.routes.map((item: any) => item.id);
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
        form.value = {
          sort: 1,
          status: 1,
          description: "",
          roleKey: "",
          name: "",
        };
      },
      detail: async function () {
        dialogVisible.value = true;
        await fns.getDetail();
        title.value = "详情";
      },
      delete: async function () {
        ElMessageBox.confirm("你确定要删除吗？", "删除角色", {
          type: "error",
        }).then(async () => {
          let res = await deleteRole(id as string);
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
        res = await updateRole(form.value?.id, form.value as RoleUpdateParams);
      } else {
        // 新增
        res = await createRoleWeb(form.value as RoleCreateParams);
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
