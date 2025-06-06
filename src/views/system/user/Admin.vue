<template>
  <div class="page" v-loading="loading">
    <div class="query_form">
      <el-form :model="query" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" plain>添加</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table :data="tableData">
      <el-table-column prop="title" label="名称" align="left" />
      <el-table-column prop="name" label="路由名称" align="center" width="200" />
      <el-table-column prop="icon" label="图标" align="center" width="200" />
      <el-table-column prop="type" label="类型" align="center" width="100" />
      <el-table-column prop="externalLinks" label="是否为外链" align="center" width="100" />
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
  const loading = ref(false);
  const query = ref({});
  const tableData = ref();
</script>

<style lang="scss" scoped></style>
