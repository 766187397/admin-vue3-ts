/** 计算el-table高度 */
export const useCountElTableHeight = () => {
  nextTick(() => {
    const tableHeight = document.querySelector<HTMLElement>(".page>.table")?.clientHeight || 0;
    const tableMenuHeight = document.querySelector<HTMLElement>(".page>.table>.table_menu")?.offsetHeight || 0;
    const elTable = document.querySelector<HTMLElement>(".page>.table>.el-table");
    if (elTable) {
      elTable.style.height = `${tableHeight - tableMenuHeight}px`;
    }
  });
};
