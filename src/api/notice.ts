/** 菜单路由相关接口 */
import type { PageApiResult, Result } from "@/types/api";
import type {
  CreateNoticeParams,
  GetNoticeByUserOrRole,
  GetNoticeParams,
  NoticeDetail,
  UpdateNoticeParams,
} from "@/types/notice";
import { http } from "@/utils/http";

/** 创建公告 */
export const createNotice = async (data: CreateNoticeParams): Promise<Result<NoticeDetail>> => {
  return await http.post("/api/v1/admin/notice/create", data);
};

/** 查询公告列表(分页,后端编辑使用查询所有) */
export const getNoticePage = async (params: GetNoticeParams): Promise<Result<PageApiResult<NoticeDetail[]>>> => {
  return await http.get("/api/v1/admin/notice/page", params);
};

/** 查询公告列表(分页,后台查询当前用户和角色权限对应的公告) */
export const getNoticeByUserOrRole = async (
  params: GetNoticeByUserOrRole
): Promise<Result<PageApiResult<NoticeDetail[]>>> => {
  return await http.get("/api/v1/admin/notice/page/userOrRole", params);
};

/** 获取公告详情 */
export const getNoticeDetail = async (id: string): Promise<Result<NoticeDetail>> => {
  return await http.get(`/api/v1/admin/notice/info/${id}`);
};

/** 更新公告 */
export const updateNotice = async (id: string, data: UpdateNoticeParams): Promise<Result<null>> => {
  return await http.patch(`/api/v1/admin/notice/info/${id}`, data);
};

/** 删除公告 */
export const deleteNotice = async (id: string): Promise<Result<null>> => {
  return await http.delete(`/api/v1/admin/notice/delete/${id}`);
};
