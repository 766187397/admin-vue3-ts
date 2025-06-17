import type { Result } from "@/types/api";
import { http } from "@/utils/http";

//#region public 不区分平台
/** 查询角色详情 */
export const getRoleDetail = async (id: string): Promise<Result<any>> => {
  return await http.get(`/api/v1/admin/routes/info/${id}`);
};

//#endregion
