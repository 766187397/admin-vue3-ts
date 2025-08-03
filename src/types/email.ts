import type { Base, PageQueryParams, QueryParams, Static } from "./public";
// Required  转换为必选
// Partial  转换为可选

type Email = Base & {
  /** 类型 */
  type: string;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
};

/** 创建邮箱模板 */
export interface CreateEmailParams extends Required<Email> {}

/** 更新公告 */
export interface UpdateEmailParams extends Partial<Email> {}

/** 不分页查询 */
export type AllQueryEmailParams = QueryParams & {
  /** 标题 */
  title?: string;
};

/** 分页查询 */
export type PageQueryEmailParams = PageQueryParams & {
  /** 标题 */
  title?: string;
};

/** 邮箱模板详情 */
export type EmailDetail = Required<Email> & Required<Static>;

/** 发送邮箱 */
export interface SendEmailParams {
  /** 模板类型 */
  type: string;

  /** 邮箱 */
  email: string;
}
