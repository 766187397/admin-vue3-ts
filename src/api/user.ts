import { http } from "@/utils/http";
import type { UsersCreateParams, UserResponseData, UsersQuery, UsersQueryParams } from "@/types/user";
import type { Result } from "@/types/api";

/** 创建用户 */
export const createUser = (data: UsersCreateParams): Promise<Result<UserResponseData>> => {
  return http.post("/api/v1/admin/users/create", data);
};

/** 不分页查询 */
export const getUsers = (data: UsersQuery): Promise<Result<UserResponseData[]>> => {
  return http.get("/api/v1/admin/users/all", data);
};

/** 分页查询用户 */
export const getUsersPage = (data: UsersQueryParams): Promise<Result<UserResponseData[]>> => {
  return http.get("/api/v1/admin/users/page", data);
};

/** 查询详情 */
export const getUserInfo = (id: number): Promise<Result<UserResponseData>> => {
  return http.get("/api/v1/admin/users/info", { id });
};

/** 更新用户 */
export const updateUser = (id: number, data: UsersCreateParams): Promise<Result<null>> => {
  return http.patch(`/api/v1/admin/users/update/${id}`, data);
};

/** 删除用户 */
export const deleteUser = (id: number): Promise<Result<null>> => {
  return http.delete(`/api/v1/admin/users/delete/${id}`);
};
