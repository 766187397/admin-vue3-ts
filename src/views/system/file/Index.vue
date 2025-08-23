<template>
  <div class="page" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <el-form-item label="文件名称：">
              <el-input v-model="query.fileName" placeholder="请输入文件名称"></el-input>
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
          <Upload @uploadSuccess="getTableData(true)" />
        </el-row>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="fileName" label="文件名称" align="center" />
        <el-table-column prop="mimetype" label="文件类型" align="center" width="140" />
        <el-table-column prop="size" label="文件大小" align="center" width="140" />
        <el-table-column prop="completePath" label="文件地址" align="center">
          <template v-slot="scope">
            <el-link type="primary" :href="scope.row.completePath" target="_blank">{{
              scope.row.completePath
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" align="center" width="200" />
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template v-slot="scope">
            <el-button type="primary" text plain @click="handleDownload(scope.row)">下载</el-button>
            <el-button type="danger" text plain @click="handleDlete(scope.row.id)">删除</el-button>
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
  </div>
</template>

<script setup lang="ts">
import Pagination from "@/components/el/Pagination.vue";
import Upload from "./components/Upload.vue";
import type { FileDetail, FilePageParams } from "@/types/file";
import { uploadFile, deleteFile, uploadPage, downloadFile } from "@/api/file";
import { ElMessage } from "element-plus";
import { useLargeFilesStore } from "@/store";

const largeFilesStore = useLargeFilesStore();

const now = new Date();
const defaultTime: [Date, Date] = [
  new Date(now.getFullYear(), now.getMonth(), now.getDate()),
  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
];

// 加载中动画
const loading = ref(false);
// 默认查询条件
const defaultQuery = {
  page: 1,
  pageSize: 10,
  fileName: "",
  time: "",
};
// 时间
const time = ref<[Date, Date]>();
// 总条数
const total = ref(0);
// 查询条件
const query = ref<FilePageParams>({
  ...defaultQuery,
});
/** 重置 */
const handleReset = () => {
  query.value = { ...defaultQuery };
  time.value = undefined;
};

/** 数据 */
const tableData = ref<FileDetail[]>();

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
  const res = await uploadPage(data);
  total.value = res.data.total;
  tableData.value = res.data.data;
  loading.value = false;
};
getTableData();

/** 文件上传 */
const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) {
    ElMessage.success("请选择文件");
    return;
  }
  const size = (file?.size || 0) / 1024 / 1024;
  const data = new FormData();
  data.append("file", file);
  if (size >= 20) {
    await largeFilesStore.upload(file);
  } else {
    const res = await uploadFile(data);
    ElMessage.success(res.message);
  }
  getTableData();
};

/** 删除 */
const handleDlete = async (id: string) => {
  ElMessageBox.confirm("你确定要删除吗？", "删除文件", {
    type: "error",
  }).then(async () => {
    let res = await deleteFile(id as string);
    getTableData();
    ElMessage.success({
      message: res?.message || "操作成功",
    });
  });
};

/** 下载 */
const handleDownload = async (row: FileDetail) => {
  await downloadFile(row.completePath);
};
</script>

<style lang="scss" scoped>
.el-link {
  width: 100%;

  :deep(.el-link__inner) {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.upload {
  position: relative;

  .upload_input {
    cursor: pointer;
    position: absolute;
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
