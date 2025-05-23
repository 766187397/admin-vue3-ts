/**
 * 登录表单数据接口
 */
export interface LoginForm {
  account: string;
  password: string;
}

/**
 * 登录响应数据接口
 */
export interface LoginResponseData {
  token_type: string;
  access_token: string;
  refresh_token: string;
  userInfo: any;
}
