/** 菜单路由相关接口 */
import type { Result } from "@/types/api";
import type {
  CreateRoutesParams,
  GetRoutesAllParams,
  GetRoutesByRoleParams,
  RoleRoutes,
  RouterInfoList,
} from "@/types/menu";
import { http } from "../index";

//#region public 不区分平台
/** 查询路由详情 */
export const getRoutesDetail = async (id: string): Promise<Result<RouterInfoList>> => {
  return await http.get(`/api/v1/admin/routes/info/${id}`);
};

/** 修改路由 */
export const updateRoutes = async (id: string | number, data: CreateRoutesParams): Promise<Result<null>> => {
  return await http.patch(`/api/v1/admin/routes/update/${id}`, data);
};

/** 删除路由 */
export const delRoutes = async (id: string | number): Promise<Result<null>> => {
  return await http.delete(`/api/v1/admin/routes/delete/${id}`);
};

/** 根据用户绑定的角色获取路由列表 */
export const getRoutesByRole = async (params?: GetRoutesByRoleParams): Promise<Result<RoleRoutes[]>> => {
  return await http.get("/api/v1/admin/routes/by/role", params);
};
//#endregion

//#region admin接口
/** 创建路由  */
export const createRouteAdmin = async (data: CreateRoutesParams): Promise<Result<RoleRoutes>> => {
  return await http.post("/api/v1/admin/routes/create/admin", data);
};

/** 查询所有路由 */
export const getRoutesAllAdmin = async (params?: GetRoutesAllParams): Promise<Result<RouterInfoList[]>> => {
  return await http.get("/api/v1/admin/routes/all/admin", params);
};
//#endregion

//#region web接口
/** 创建路由  */
export const createRouteWeb = async (data: CreateRoutesParams): Promise<Result<RoleRoutes>> => {
  return await http.post("/api/v1/admin/routes/create/web", data);
};
/** 查询所有路由 */
export const getRoutesAllWeb = async (params?: GetRoutesAllParams): Promise<Result<RouterInfoList[]>> => {
  return await http.get("/api/v1/admin/routes/all/web", params);
};
//#endregion
