/** 接口返回基础类型 */
export interface Base {
  /** id */
  id: string;
  /** 排序 */
  sort: number;
  /** 状态 */
  status: number;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/** 不分页查询 */
export interface QueryParams {
  /** ASC - 升序，DESC - 降序 */
  sort?: "ASC" | "DESC";
  status?: string;
  time?: string;
}

/** 分页查询 */
export interface PageQueryParams extends QueryParams {
  page?: number;
  pageSize?: number;
}

/** 自定义弹窗类型 */
export type HandleRowType = "edit" | "add" | "detail" | "delete";
