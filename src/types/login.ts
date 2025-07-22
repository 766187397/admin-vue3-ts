import type { Base, Static } from "./public";
import type { RoleDetail } from "./role";
/** 登录表单数据接口 */
export interface LoginForm {
  account: string;
  password: string;
}

/** 登录表单数据接口 */
export interface EmailLoginForm {
  email: string;
  code: string;
}

/** 用户信息 */
export type userInfo = Base &
  Static & {
    account: string;
    nickName: string;
    email: string;
    phone: string;
    sex: string;
    avatar: string;
    roles: RoleDetail[];
  };

/** 登录响应数据接口 */
export interface LoginResponseData {
  readonly token_type: string;
  readonly access_token: string;
  readonly refresh_token: string;
  userInfo: userInfo;
}
