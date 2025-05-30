import type { Result } from "@/types/api";
import type { getRoutesParams, RoleRoutes } from "@/types/menu";
import { http } from "@/utils/http";

/** 根据用户绑定的角色获取路由列表 */
export const getRoutes = async (params?: getRoutesParams): Promise<Result<RoleRoutes[]>> => {
  return await http.get<any>("/api/v1/admin/routes/by/role", params);
};
