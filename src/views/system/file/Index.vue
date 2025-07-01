<template>
  <div class="page" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="文件名称：">
              <el-input v-model="query.fileName" placeholder="请输入文件名称"></el-input>
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
          <el-col :span="1.5">
            <el-button type="primary" plain>添加</el-button>
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
            <el-button type="danger" text plain>删除</el-button>
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
  import type { FileDetail, FilePageParams } from "@/types/file";
  import { uploadFile, deleteFile, getFileDetail, uploadPage } from "@/api/file";

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
</script>

<style lang="scss" scoped></style>
