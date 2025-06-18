/** 登录模块接口 */

import { http } from "@/utils/http";
import type { LoginForm, LoginResponseData } from "@/types/login";
import type { Result } from "@/types/api";

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns 登录响应数据
 */
export const login = (data: LoginForm): Promise<Result<LoginResponseData>> => {
  return http.post("/api/v1/admin/users/logIn", data);
};

/** 退出登录 */
export const logout = (): Promise<Result<null>> => {
  return http.get("/api/v1/admin/users/logout");
};
