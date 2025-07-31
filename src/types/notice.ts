import type { Base, PageQueryParams, Static } from "./public";
// Required  转换为必选
// Partial  转换为可选

type Notice = Base & {
  /*角色权限 */
  roleKeys?: string;

  /*用户ids（逗号隔开） */
  userIds?: string;

  /*内容 */
  content?: string;

  /*指定时间 */
  specifyTime: string;

  /*指定的平台标识（如admin/web/app/mini） */
  platform: string;

  /*标题 */
  title: string;
};

/** 创建公告 */
export type CreateNoticeParams = Partial<Notice> & {
  /*指定时间 */
  specifyTime: string;

  /*指定的平台标识（如admin/web/app/mini） */
  platform: string;

  /*标题 */
  title: string;
};

/** 更新公告 */
export type UpdateNoticeParams = Partial<CreateNoticeParams>;

/** 列表查询参数 查询公告列表(分页,后端编辑使用查询所有) */
export type GetNoticeParams = PageQueryParams & {
  /** 标签 */
  title?: string;
};

/** 查询公告列表(分页,后台查询当前用户和角色权限对应的公告) */
export interface GetNoticeByUserOrRole extends PageQueryParams {
  page?: number;
  pageSize?: number;
}

/** 公告详情 */
export type NoticeDetail = Required<Notice> & Required<Static>;
