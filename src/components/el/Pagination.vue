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
  interface PaginationProps {
    pageSizes?: [];
    layout?: string;
  }

  let page = defineModel("page", { type: Number, default: 1 });
  let pageSize = defineModel("pageSize", { type: Number, default: 10 });
  let total = defineModel("total", { type: Number, default: 0 });

  let { pageSizes = [10, 20, 50, 100, 200], layout = "total, sizes, prev, pager, next, jumper" } =
    defineProps<PaginationProps>();

  const emit = defineEmits<{
    (e: "size-change", val: number): void;
    (e: "current-change", val: number): void;
  }>();

  // 每页显示条数改变
  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    emit("size-change", val);
  };

  // 页码改变
  const handleCurrentChange = (val: number) => {
    page.value = val;
    emit("current-change", val);
  };
</script>

<style lang="scss" scoped></style>
