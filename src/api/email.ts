import { http } from "@/utils/http"; /** 菜单路由相关接口 */
import type { PageApiResult, Result } from "@/types/api";
import {
  type AllQueryEmailParams,
  type CreateEmailParams,
  type EmailDetail,
  type PageQueryEmailParams,
  type SendEmailParams,
  type UpdateEmailParams,
} from "@/types/email";

//#region public 不区分平台
/** 查询邮箱详情 */
export const getEmailDetail = async (id: string): Promise<Result<EmailDetail>> => {
  return await http.get(`/api/v1/admin/email/info/${id}`);
};

/** 更新邮箱模板 */
export const updateEmail = async (id: string, data: UpdateEmailParams): Promise<Result<null>> => {
  return await http.patch(`/api/v1/admin/email/update/${id}`, data);
};

/** 删除邮箱模板 */
export const deleteEmail = async (id: string): Promise<Result<null>> => {
  return await http.delete(`/api/v1/admin/email/delete/${id}`);
};

/** 发送邮箱 */
export const sendEmail = async (data: SendEmailParams): Promise<Result<null>> => {
  return await http.post(`/api/v1/admin/email/send/email`, data);
};
//#endregion

//#region admin
/** 创建邮箱模板 */
export const createEmailAdmin = async (data: CreateEmailParams): Promise<Result<null>> => {
  return await http.post(`/api/v1/admin/email/create/admin`, data);
};

/** 分页查询 */
export const getEmailPageAdmin = async (
  params: PageQueryEmailParams
): Promise<Result<PageApiResult<EmailDetail[]>>> => {
  return await http.get(`/api/v1/admin/email/page/admin`, params);
};

/** 不分页查询 */
export const getEmailAllAdmin = async (params: AllQueryEmailParams): Promise<Result<EmailDetail[]>> => {
  return await http.get(`/api/v1/admin/email/all/admin`, params);
};
//#endregion

//#region web
/** 创建邮箱模板 */
export const createEmailWeb = async (data: CreateEmailParams): Promise<Result<null>> => {
  return await http.post(`/api/v1/admin/email/create/web`, data);
};

/** 分页查询 */
export const getEmailPageWeb = async (params: PageQueryEmailParams): Promise<Result<PageApiResult<EmailDetail[]>>> => {
  return await http.get(`/api/v1/admin/email/page/web`, params);
};

/** 不分页查询 */
export const getEmailAllWeb = async (params: AllQueryEmailParams): Promise<Result<EmailDetail[]>> => {
  return await http.get(`/api/v1/admin/email/all/web`, params);
};
//#endregion
