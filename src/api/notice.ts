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

//#region public 不区分平台
/** 获取公告详情 */
export const getNoticeDetail = async (id: string): Promise<Result<NoticeDetail>> => {
  return await http.get(`/api/v1/admin/notice/info/${id}`);
};

/** 更新公告 */
export const updateNotice = async (id: string, data: UpdateNoticeParams): Promise<Result<null>> => {
  return await http.patch(`/api/v1/admin/notice/update/${id}`, data);
};

/** 删除公告 */
export const deleteNotice = async (id: string): Promise<Result<null>> => {
  return await http.delete(`/api/v1/admin/notice/delete/${id}`);
};
//#endregion

//#region admin 平台
/** 创建公告 */
export const createNoticeAdmin = async (data: CreateNoticeParams): Promise<Result<NoticeDetail>> => {
  return await http.post("/api/v1/admin/notice/create/admin", data);
};

/** 查询公告列表(分页,后端编辑使用查询所有) */
export const getNoticePageAdmin = async (params: GetNoticeParams): Promise<Result<PageApiResult<NoticeDetail[]>>> => {
  return await http.get("/api/v1/admin/notice/page/admin", params);
};

/** 查询公告列表(分页,后台查询当前用户和角色权限对应的公告) */
export const getNoticeByUserOrRoleAdmin = async (
  params: GetNoticeByUserOrRole
): Promise<Result<PageApiResult<NoticeDetail[]>>> => {
  return await http.get("/api/v1/admin/notice/page/userOrRole/admin", params);
};
//#endregion

//#region web 平台
/** 创建公告 */
export const createNoticeWeb = async (data: CreateNoticeParams): Promise<Result<NoticeDetail>> => {
  return await http.post("/api/v1/admin/notice/create/web", data);
};

/** 查询公告列表(分页,后端编辑使用查询所有) */
export const getNoticePageWeb = async (params: GetNoticeParams): Promise<Result<PageApiResult<NoticeDetail[]>>> => {
  return await http.get("/api/v1/admin/notice/page/web", params);
};

/** 查询公告列表(分页,后台查询当前用户和角色权限对应的公告) */
export const getNoticeByUserOrRoleWeb = async (
  params: GetNoticeByUserOrRole
): Promise<Result<PageApiResult<NoticeDetail[]>>> => {
  return await http.get("/api/v1/admin/notice/page/userOrRole/web", params);
};
//#endregion
