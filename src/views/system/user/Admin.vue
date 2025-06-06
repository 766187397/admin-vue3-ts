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
              <el-input v-model="query.nickName" placeholder="请输入账号"></el-input>
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" plain>添加</el-button>
          </el-col>
        </el-row>
      </el-form>
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
</template>

<script setup lang="ts">
  import { getUsersPage } from "@/api/user";
  import type { UserResponseData, UsersQueryParams } from "@/types/user";
  const loading = ref(false);
  const query = ref<UsersQueryParams>({
    page: 1,
    pageSize: 10,
    account: "",
    nickName: "",
    email: "",
    phone: "",
  });
  const tableData = ref<UserResponseData[]>();

  const getTableData = async () => {
    loading.value = true;
    let data = { ...query.value };
    const res = await getUsersPage(data);
    tableData.value = res.data.data;
    loading.value = false;
  };
  getTableData();
</script>

<style lang="scss" scoped></style>
