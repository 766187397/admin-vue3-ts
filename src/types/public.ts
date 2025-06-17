/** 分页查询 */
export interface PageQueryParams {
  page?: number;
  pageSize?: number;
  total?: number;
}

/** 自定义弹窗类型 */
export type HandleRowType = "edit" | "add" | "detail";
