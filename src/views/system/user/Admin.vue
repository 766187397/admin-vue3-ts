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
            <el-button type="primary" text plain>编辑</el-button>
            <el-button type="primary" text plain>新增</el-button>
            <el-button type="danger" text plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <div class="footer">
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="query.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div> -->

    <Pagination
      v-model:pageSize="query.pageSize"
      v-model:page="query.page"
      v-model:total="query.total"
      @size-change="getTableData(true)"
      @current-change="getTableData(false)" />
  </div>
</template>

<script setup lang="ts">
  import { getUsersPage } from "@/api/user";
  import Pagination from "@/components/el/Pagination.vue";
  import type { UserResponseData, UsersQueryParams } from "@/types/user";
  const now = new Date();
  const defaultTime: [Date, Date] = [
    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
  ];
  const loading = ref(false);
  const defaultQuery = {
    page: 1,
    pageSize: 1,
    total: 0,
    account: "",
    nickName: "",
    email: "",
    phone: "",
  };
  const query = ref<UsersQueryParams>({
    ...defaultQuery,
  });
  /** 重置 */
  const handleReset = () => {
    query.value = { ...defaultQuery };
  };

  const tableData = ref<UserResponseData[]>();

  /** 查询数据 */
  const getTableData = async (type: boolean = false) => {
    if (type) {
      query.value.page = 1;
    }
    loading.value = true;
    let data = { ...query.value };
    const res = await getUsersPage(data);
    query.value.total = res.data.total;
    tableData.value = res.data.data;
    loading.value = false;
  };
  getTableData();
</script>

<style lang="scss" scoped></style>
