<template>
  <div class="admin_route">
    <el-form :model="query" label-width="auto">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="类型：">
            <el-input v-model="query.type" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" row-key="id" default-expand-all>
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
  const query = reactive({
    type: "",
  });

  const tableData = reactive([]);
</script>

<style lang="scss" scoped></style>
