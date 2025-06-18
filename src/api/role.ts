import type { Result } from "@/types/api";
import type { RoleUpdateParams, RoleDetail, RoleQuery, RoleQueryParams, RoleCreateParams } from "@/types/role";
import { http } from "@/utils/http";

//#region public 不区分平台
/** 查询角色详情 */
export const getRoleDetail = async (id: string): Promise<Result<any>> => {
  return await http.get(`/api/v1/admin/routes/info/${id}`);
};

/** 更新角色 */
export const updateRole = async (id: string, data: RoleUpdateParams): Promise<Result<null>> => {
  return await http.patch(`/api/v1/admin/roles/${id}`, data);
};

/** 删除角色 */
export const deleteRole = async (id: string): Promise<Result<null>> => {
  return await http.delete(`/api/v1/admin/roles/${id}`);
};

//#endregion

//#region admin 平台
/** 创建角色 */
export const createRoleAdmin = async (data: RoleCreateParams): Promise<Result<null>> => {
  return await http.post(`/api/v1/admin/roles/create/admin`, data);
};

/** 不分页查询角色 */
export const getRolesAllAdmin = async (data: RoleQuery): Promise<Result<RoleDetail[]>> => {
  return await http.get(`/api/v1/admin/roles/all/admin`, data);
};

/** 分页查询角色 */
export const getRolesByRoleAdmin = async (data: RoleQueryParams): Promise<Result<RoleDetail[]>> => {
  return await http.get(`/api/v1/admin/roles/page/admin`, data);
};

//#endregion

//#region web 平台
/** 创建角色 */
export const createRoleWeb = async (data: RoleCreateParams): Promise<Result<RoleDetail>> => {
  return await http.post(`/api/v1/admin/roles/create/web`, data);
};

/** 不分页查询角色 */
export const getRolesAllWeb = async (data: RoleQuery): Promise<Result<RoleDetail[]>> => {
  return await http.get(`/api/v1/admin/roles/all/web`, data);
};

/** 分页查询角色 */
export const getRolesByRoleWeb = async (data: RoleQueryParams): Promise<Result<RoleDetail[]>> => {
  return await http.get(`/api/v1/admin/roles/page/web`, data);
};

//#endregion
