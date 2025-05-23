/** 接口统一处理的数据 */
export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

/** 分页返回data数据 */
export interface PageApiResult<T> {
  data: T;
  total: number;
  totalPages: number;
  page: number | string;
  pageSize: number | string;
}
