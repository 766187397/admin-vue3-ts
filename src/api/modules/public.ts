/** 公共模块 */
import type { Result } from "@/types/api";
import type { GetDictionaryItemAllParams, GetDictionaryItemAllResult } from "@/types/dictionary";
import type { SendEmailParams } from "@/types/email";
import type { Captcha } from "@/types/public";
import { http } from "../index";

/** 查询字典项 */
export const getDictionaryItemAll = async (
  params: GetDictionaryItemAllParams
): Promise<Result<GetDictionaryItemAllResult[]>> => {
  return await http.get("/api/v1/admin/dictionaryItem/all", params);
};

/** 发送邮箱 */
export const sendEmail = async (data: SendEmailParams): Promise<Result<null>> => {
  return await http.post("/api/v1/admin/email/send/email", data);
};

/** 获取验证码 */
export const getCode = async (): Promise<Result<Captcha>> => {
  return await http.get("/api/v1/admin/users/captcha");
};
