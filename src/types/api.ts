/** 接口统一处理的数据 */
export interface Result<T> {
  /** 接口返回数据 */
  data: T;
  /** 状态码 */
  readonly code: number;
  /** 接口返回描述 */
  readonly message: string;
}

/** 分页返回data数据 */
export interface PageApiResult<T> {
  /** 接口返回数据 */
  data: T;
  /** 总数 */
  readonly total: number;
  /** 总页数 */
  readonly totalPages: number;
  /** 当前页码 */
  readonly page: number | string;
  /** 每页条数 */
  readonly pageSize: number | string;
}
