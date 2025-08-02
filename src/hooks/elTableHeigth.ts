/** 计算el-table高度 */
export const countElTableHeight = () => {
  nextTick(() => {
    const tableHeight = document.querySelector<HTMLElement>(".page>.table")?.clientHeight || 0;
    const tableMenuHeight = document.querySelector<HTMLElement>(".page>.table>.table_menu")?.offsetHeight || 0;
    document.querySelector<HTMLElement>(".page>.table>.el-table")!.style.height = `${tableHeight - tableMenuHeight}px`;
  });
};
