/** 接口返回基础类型 */
export interface Base {
  id: string;
  sort: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

/** 不分页查询 */
export interface QueryParams {
  sort?: string;
  status?: string;
  time?: string;
}

/** 分页查询 */
export interface PageQueryParams extends QueryParams {
  page?: number;
  pageSize?: number;
  total?: number;
}

/** 自定义弹窗类型 */
export type HandleRowType = "edit" | "add" | "detail" | "delete";
