<template>
  <div class="footer">
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script setup lang="ts">
  interface PaginationModel {
    page: number;
    pageSize: number;
    total: number;
  }
  interface PaginationProps {
    pageSizes?: [];
    layout?: string;
  }

  let page = defineModel("page", { type: Number, default: 1 });
  let pageSize = defineModel("pageSize", { type: Number, default: 10 });
  let total = defineModel("total", { type: Number, default: 0 });

  let { pageSizes = [10, 20, 50, 100, 200], layout = "total, sizes, prev, pager, next, jumper" } =
    defineProps<PaginationProps>();

  const emit = defineEmits(["update:page", "update:pageSize"]);

  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    emit("update:pageSize", val);
  };

  const handleCurrentChange = (val: number) => {
    page.value = val;
    emit("update:page", val);
  };
</script>

<style lang="scss" scoped></style>
