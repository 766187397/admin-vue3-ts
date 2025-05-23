import type { getRoutesParams } from "@/types/menu";
import { http } from "@/utils/http";

/** 获取路由列表 */
export const getRoutes = async (params?: getRoutesParams) => {
  return await http.get<any>("/api/v1/admin/routes/by/role", params);
};
