<template>
  <div class="page" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :xl="8" :lg="8" :md="12" :sm="24" :xs="24">
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
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-button type="primary" plain @click="getTableData(true)">查询</el-button>
            <el-button plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" default-expand-all>
        <el-table-column prop="account" label="账号" align="center" width="200" />
        <el-table-column prop="nickName" label="昵称" align="center" width="200" />
        <el-table-column prop="apiPlatform" label="接口平台" align="center" width="100" />
        <!-- <el-table-column prop="browser" label="浏览器信息" align="center" /> -->
        <!-- <el-table-column prop="referer" label="来源" align="center" /> -->
        <el-table-column prop="method" label="请求方式" align="center" />
        <el-table-column prop="url" label="请求接口" align="center" />
        <el-table-column prop="createdAt" label="创建时间" align="center" width="200" />
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template v-slot="scope">
            <el-button type="primary" text plain @click="handleShowDetails(scope.row)">详情</el-button>
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

    <el-dialog v-model="dialogVisible" title="详情" width="980" :before-close="handleClose">
      <div class="dialog" v-if="form">
        <el-form ref="formRef" :model="form" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="账号：">{{ form.account }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="昵称：">{{ form.nickName }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接口平台：">{{ form.apiPlatform }} </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="浏览器信息：">{{ form.browser }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求来源：">{{ form.referer }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="IP：">{{ form.IP }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求方式：">{{ form.method }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接口地址：">{{ form.url }} </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求耗时(ms)：">{{ form.responseTime }} </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="请求结果：">
                <el-input
                  readonly
                  v-model="form.resData"
                  style="width: 100%"
                  :rows="6"
                  type="textarea"
                  placeholder="Please input"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Pagination from "@/components/el/Pagination.vue";
import { type FormInstance } from "element-plus";
import {getLogPageWeb} from '@/api/log'
import type { LogDetail, LogPageParams } from "@/types/log";

const now = new Date();
const defaultTime: [Date, Date] = [
  new Date(now.getFullYear(), now.getMonth(), now.getDate()),
  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
];

// 加载中动画
const loading = ref(false);
// 弹窗状态
const dialogVisible = ref(false);

// 默认查询条件
const defaultQuery = {
  page: 1,
  pageSize: 10,
  time: "",
};
// 时间
const time = ref();
// 总条数
const total = ref(0);
// 查询条件
const query = ref<LogPageParams>({
  ...defaultQuery,
});
/** 重置 */
const handleReset = () => {
  query.value = { ...defaultQuery };
  time.value = undefined;
};

/** 数据 */
const tableData = ref<LogDetail[]>();

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
  const res = await getLogPageWeb(data);
  total.value = res.data.total;
  tableData.value = res.data.data;
  loading.value = false;
};
getTableData();

// 表单数据
const form = ref<LogDetail>();


// 关闭弹窗
const handleClose = () => {
  form.value = undefined;
  dialogVisible.value = false;
};

const formRef = useTemplateRef<FormInstance>("formRef");

/** 行操作 */
const handleShowDetails = (row:LogDetail)=>{
  form.value = row
  dialogVisible.value = true;
}
</script>

<style lang="scss" scoped></style>
