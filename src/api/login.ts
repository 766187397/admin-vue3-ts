import { http } from "@/utils/http";
import type { LoginForm, LoginResponse } from "@/types/login";

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns 登录响应数据
 */
export const login = (data: LoginForm): Promise<LoginResponse> => {
  return http.post("/api/v1/admin/users/logIn", data);
};
