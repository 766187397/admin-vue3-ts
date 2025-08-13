/** 接口返回静态数据 */
export interface Static {
  /** id */
  readonly id: string;
  /** 创建时间 */
  readonly createdAt: string;
  /** 更新时间 */
  readonly updatedAt: string;
}

/** 基础类型 */
export interface Base {
  /** 排序 */
  sort?: number;
  /** 状态 */
  status?: number;
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

/** 验证码返回结果 */
export interface Captcha {
  /** 验证码 */
  codeKey: string;
  /** 验证码图片 */
  url: string;
}

/** 验证码验证 */
export interface CaptchaVerify {
  /** 验证码 */
  codeKey: string;
  /** 验证码 */
  code: string;
}
