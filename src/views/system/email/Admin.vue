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
                end-placeholder="结束日期"
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
      <el-table :data="tableData" :preserve-expanded-content="false">
        <el-table-column type="expand">
          <template #default="props">
            <iframe :srcdoc="props.row.content" width="100%" height="420" style="border: none"></iframe>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center" />
        <el-table-column prop="type" label="类型" align="center" />
        <el-table-column prop="createdAt" label="创建时间" align="center" width="200" />
        <el-table-column label="操作" align="center" fixed="right" width="300">
          <template v-slot="scope">
            <el-button type="primary" text plain @click="handleShowSendEmail(scope.row)">
              发送邮箱
            </el-button>
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

    <el-dialog top="10vh" v-model="dialogVisible" :title="title" width="980" :before-close="handleClose">
      <div class="dialog" v-if="form">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="标题：" prop="title">
                <el-input v-model="form.title" placeholder="请输入标题" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型：" prop="type">
                <el-input v-model="form.type" placeholder="请输入类型" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="内容：" prop="content">
                <div class="monaco_editor">
                  <MonacoEditor v-model="form.content" language="html" />
                </div>
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

    <el-dialog v-model="showSend" title="发送邮件" width="500px" @open="handleeGetCode" class="sendForm">
      <el-form ref="sendFormRef" :model="sendForm" :rules="sendRules" label-width="auto">
        <el-form-item label="收件邮箱：" prop="email">
          <el-input v-model="sendForm.email" placeholder="请输入收件邮箱" clearable></el-input>
        </el-form-item>

        <el-form-item label="验证码：" prop="code">
          <el-form-item prop="code">
            <div class="row">
              <el-input class="custom-input" v-model="sendForm.code" :prefix-icon="ChatSquare" />
              <img :src="codeUrl" alt="验证码" @click="handleeGetCode" />
            </div>
          </el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="showSend = false">取消</el-button>
          <el-button type="primary" @click="handleSendEmail">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Pagination from "@/components/el/Pagination.vue";
import MonacoEditor from '@/components/public/MonacoEditor.vue'
import { ElMessage, type FormInstance } from "element-plus";
import type { HandleRowType } from "@/types/public";
import type {
  CreateEmailParams,
  EmailDetail,
  PageQueryEmailParams,
  SendEmailParams,
  UpdateEmailParams,
} from "@/types/email";
import { createEmailAdmin, deleteEmail, getEmailDetail, getEmailPageAdmin, updateEmail } from "@/api/email";
import { getCode, sendEmail } from "@/api/public";
import { ChatSquare } from "@element-plus/icons-vue";

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
// 发送邮箱弹窗
const showSend = ref(false);
// 弹窗名称
const title = ref("");
// 验证码
const codeUrl = ref("");
// 默认查询条件
const defaultQuery = {
  page: 1,
  pageSize: 10,
  time: "",
  title: "",
};
// 时间
const time = ref<[Date, Date]>();
// 总条数
const total = ref(0);
// 查询条件
const query = ref<PageQueryEmailParams>({
  ...defaultQuery,
});
/** 重置 */
const handleReset = () => {
  query.value = { ...defaultQuery };
  time.value = undefined;
};

/** 数据 */
const tableData = ref<EmailDetail[]>();

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
  const res = await getEmailPageAdmin(data);
  total.value = res.data.total;
  tableData.value = res.data.data;
  loading.value = false;
};
getTableData();

// 表单数据
const form = ref<CreateEmailParams | UpdateEmailParams | EmailDetail>();
const rules = ref({
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  type: [{ required: true, message: "请输入类型", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
});

// 验证邮箱
const validateEmail = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入邮箱"));
  } else if (
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
  ) {
    callback();
  } else {
    callback(new Error("邮箱格式错误"));
  }
};

// 验证验证码
const validateCode = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入验证码"));
  } else if (value.length == 4) {
    callback();
  } else {
    callback(new Error("图形验证码长度为 4 个字符"));
  }
};

// 发送邮件表单
const sendForm = ref<SendEmailParams>({
  type: "",
  email: "",
  code: "",
  codeKey: "",
});
const sendRules = ref({
  email: [
    { required: true, message: "请输入邮箱", trigger: ["blur", "change"] },
    { validator: validateEmail, trigger: ["blur", "change"] }],
  code:[
    { required: true, message: "请输入图形验证码", trigger: ["blur", "change"] },
    { validator: validateCode, trigger: ["blur", "change"] },
  ]
});

/** 显示发送邮箱 */
const handleShowSendEmail = (item: EmailDetail) => {
  showSend.value = true;
  sendForm.value = {
    type: item.type,
    email: "",
    code: "",
    codeKey: "",
  };
};

/** 表单 */
const sendFormRef = useTemplateRef<FormInstance>("sendFormRef");
/** 发送邮箱 */
const handleSendEmail = () => {
  if (!sendFormRef.value) return;
  sendFormRef.value?.validate(async (valid) => {
    if (!valid) return;
    try {
      buttonLoading.value = true;
      ElMessageBox.confirm("您是否确认发送邮件？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await sendEmail(sendForm.value);
        ElMessage.success(res.message);
        showSend.value = false;
      });
    } catch (error) {
      console.log("error :>> ", error);
    } finally {
      buttonLoading.value = false;
    }
  });
};

/** 行操作 */
const handleRow = async (type: HandleRowType, id?: string) => {
  try {
    loading.value = true;
    const fns = {
      getDetail: async function () {
        let res = await getEmailDetail(id as string);
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
          status: 1,
          sort: 1,
        };
      },
      detail: async function () {
        dialogVisible.value = true;
        await fns.getDetail();
        title.value = "详情";
      },
      delete: async function () {
        ElMessageBox.confirm("你确定要删除吗？", "删除", {
          type: "error",
        }).then(async () => {
          let res = await deleteEmail(id as string);
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
const formRef = useTemplateRef<FormInstance>("formRef");

/** 提交 */
const submit = () => {
  if (!formRef.value) return;
  formRef.value?.validate(async (valid) => {
    if (!valid) return;
    try {
      buttonLoading.value = true;
      let res;
      let data: any = { ...form.value };
      // 调用接口
      if ("id" in data!) {
        // 编辑
        res = await updateEmail(data?.id, data);
      } else {
        // 新增
        res = await createEmailAdmin(data as CreateEmailParams);
      }
      dialogVisible.value = false;
      ElMessage.success({
        message: res?.message || "操作成功",
      });
      getTableData();
    } catch (error) {
      console.log("error :>> ", error);
    } finally {
      buttonLoading.value = false;
    }
  });
};

// 获取验证码
const handleeGetCode = async () => {
  const res = await getCode();
  sendForm.value.codeKey = res.data.codeKey;
  codeUrl.value = res.data.url;
};
</script>

<style lang="scss" scoped>
.page {
  .monaco_editor {
    width: 100%;
    height: 500px;
  }
  .sendForm {
    .row {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 20px;

      .emailCode {
        flex: 0 0 140px;
        height: 100%;
      }
    }
  }
}
</style>
