import type { Result } from "@/types/api";
import type { createRoutesParams, getRoutesAllParams, getRoutesByRoleParams, RoleRoutes } from "@/types/menu";
import { http } from "@/utils/http";

/** 创建路由 */
export const createRoute = async (data: createRoutesParams): Promise<Result<RoleRoutes>> => {
  return await http.post<Result<RoleRoutes>>("/api/v1/admin/routes/create", data);
};

/** 查询所有路由 */
export const getRoutesAll = async (params?: getRoutesAllParams): Promise<Result<RoleRoutes[]>> => {
  return await http.get<Result<RoleRoutes[]>>("/api/v1/admin/routes/all", params);
};

/** 查询路由详情 */
export const getRoutesDetail = async (id: string): Promise<Result<RoleRoutes>> => {
  return await http.get<Result<RoleRoutes>>(`/api/v1/admin/routes/info/${id}`);
};

/** 修改路由 */
export const updateRoutes = async (id: string, data: RoleRoutes): Promise<Result<null>> => {
  return await http.patch<Result<null>>(`/api/v1/admin/routes/update/${id}`, data);
};

/** 删除路由 */
export const delRoutes = async (id: string): Promise<Result<null>> => {
  return await http.delete<Result<null>>(`/api/v1/admin/routes/delete/${id}`);
};

/** 根据用户绑定的角色获取路由列表 */
export const getRoutesByRole = async (params?: getRoutesByRoleParams): Promise<Result<RoleRoutes[]>> => {
  return await http.get<Result<RoleRoutes[]>>("/api/v1/admin/routes/by/role", params);
};
