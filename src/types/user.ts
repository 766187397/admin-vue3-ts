import type { Base, PageQueryParams, Static } from "./public";
// Required  转换为必选
// Partial  转换为可选

/** 用户信息 */
type User = Base & {
  /*邮箱 */
  email: string;

  /*手机号 */
  phone: string;

  /*性别 0未知 1男 2女,可用值:0,1,2 */
  sex: string;

  /*头像 */
  avatar: string;

  /*角色 */
  roleIds: any[];

  /*账号 */
  account: string;

  /*昵称 */
  nickName: string;

  /*密码 */
  password: string;
};

/** 创建用户 */
export type UsersCreateParams = Partial<User> & {
  /*账号 */
  account: string;

  /*昵称 */
  nickName: string;

  /*密码 */
  password: string;
};

/** 更新用户信息 */
export type UsersUpdateParams = Partial<UsersCreateParams>;

/** 不分页查询用户 */
export interface UsersQuery {
  sort?: string;
  status?: string;
  time?: string;
  account?: string;
  nickName?: string;
  email?: string;
  phone?: string;
}

/** 分页查询用户 */
export type UsersQueryParams = UsersQuery & PageQueryParams;

/** 返回用户信息 */
export type UserResponseData = User & Static;
