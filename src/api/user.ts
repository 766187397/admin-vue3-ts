import { http } from "@/utils/http";
import type { UsersCreateParams, UserResponseData, UsersQuery, UsersQueryParams } from "@/types/user";
import type { PageApiResult, Result } from "@/types/api";

//#region public 不区分平台
/** 查询详情 */
export const getUserInfo = (id: string): Promise<Result<UserResponseData>> => {
  return http.get(`/api/v1/admin/users/info/${id}`);
};

/** 更新用户 */
export const updateUser = (id: string, data: UsersCreateParams): Promise<Result<null>> => {
  return http.patch(`/api/v1/admin/users/update/${id}`, data);
};

/** 删除用户 */
export const deleteUser = (id: string): Promise<Result<null>> => {
  return http.delete(`/api/v1/admin/users/delete/${id}`);
};

//#endregion

//#region admin接口
/** 创建用户 */
export const createUserAdmin = (data: UsersCreateParams): Promise<Result<UserResponseData>> => {
  return http.post("/api/v1/admin/users/create/admin", data);
};

/** 不分页查询 */
export const getUsersAdmin = (data: UsersQuery): Promise<Result<UserResponseData[]>> => {
  return http.get("/api/v1/admin/users/all/admin", data);
};

/** 分页查询用户 */
export const getUsersPageAdmin = (data: UsersQueryParams): Promise<Result<PageApiResult<UserResponseData[]>>> => {
  return http.get("/api/v1/admin/users/page/admin", data);
};
//#endregion

//#region web接口
/** 创建用户 */
export const createUserWeb = (data: UsersCreateParams): Promise<Result<UserResponseData>> => {
  return http.post("/api/v1/admin/users/create/web", data);
};

/** 不分页查询 */
export const getUsersWeb = (data: UsersQuery): Promise<Result<UserResponseData[]>> => {
  return http.get("/api/v1/admin/users/all/web", data);
};

/** 分页查询用户 */
export const getUsersPageWeb = (data: UsersQueryParams): Promise<Result<PageApiResult<UserResponseData[]>>> => {
  return http.get("/api/v1/admin/users/page/web", data);
};
//#endregion
