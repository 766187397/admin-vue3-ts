/** 角色模块接口 */

import { http } from "../index";
import type {
  UsersCreateParams,
  UserResponseData,
  UsersQuery,
  UsersQueryParams,
  UsersUpdateParams,
} from "@/types/user";
import type { PageApiResult, Result } from "@/types/api";

//#region public 不区分平台
/** 查询详情 */
export const getUserInfo = (id: string): Promise<Result<UserResponseData>> => {
  return http.get(`/api/v1/admin/users/info/${id}`);
};

/** 更新用户 */
export const updateUser = (id: string, data: UsersUpdateParams): Promise<Result<null>> => {
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
export const getUsersAdmin = (data?: UsersQuery): Promise<Result<UserResponseData[]>> => {
  return http.get("/api/v1/admin/users/all/admin", data);
};

/** 分页查询用户 */
export const getUsersPageAdmin = (
  data?: UsersQueryParams
): Promise<Result<PageApiResult<UserResponseData[]>>> => {
  return http.get("/api/v1/admin/users/page/admin", data);
};

/** 导出为excel */
export const getUsersExcelAdmin = async (data?: UsersQueryParams, filename?: string): Promise<void> => {
  try {
    let res: any = await http.get("/api/v1/admin/users/export/admin", data, {
      responseType: "blob",
      headers: {
        noResFilter: true,
      },
    });

    // 从响应头或 url 里取文件名
    const name =
      filename || decodeURIComponent(res.headers["content-disposition"]?.split("filename=")[1] || "file");

    // 创建临时 URL 并触发下载
    const blob = new Blob([res.data]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // 移除首尾"后端因为浏览器的标准协议的加上的引号，如果保留"那么下载会把首尾的双引号替换为_
    link.download = name.trim().replace(/^["']|["']$/g, "")
    link.click();

    // 释放内存
    URL.revokeObjectURL(link.href);
  } catch (error) {
    http.handleError(error);
  }
};
//#endregion

//#region web接口
/** 创建用户 */
export const createUserWeb = (data: UsersCreateParams): Promise<Result<UserResponseData>> => {
  return http.post("/api/v1/admin/users/create/web", data);
};

/** 不分页查询 */
export const getUsersWeb = (data?: UsersQuery): Promise<Result<UserResponseData[]>> => {
  return http.get("/api/v1/admin/users/all/web", data);
};

/** 分页查询用户 */
export const getUsersPageWeb = (
  data?: UsersQueryParams
): Promise<Result<PageApiResult<UserResponseData[]>>> => {
  return http.get("/api/v1/admin/users/page/web", data);
};

/** 导出为excel */
export const getUsersExcelWeb = (data?: UsersQueryParams): Promise<any> => {
  return http.get("/api/v1/admin/users/export/web", data, {
    responseType: "blob",
    headers: {
      noResFilter: true,
    },
  });
};
//#endregion
