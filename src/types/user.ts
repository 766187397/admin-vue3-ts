import type { PageQueryParams } from "./public";

/** 创建用户 */
export interface UsersCreateParams {
  /*排序 */
  sort?: number;

  /*状态；1 - 启用，2 - 禁用；根据模块业务定义 */
  status?: number;

  /*邮箱 */
  email?: string;

  /*手机号 */
  phone?: string;

  /*性别 0未知 1男 2女,可用值:0,1,2 */
  sex?: string;

  /*头像 */
  avatar?: string;

  /*角色id */
  roleIds?: Record<string, unknown>[];

  /*账号 */
  account: string;

  /*昵称 */
  nickName: string;

  /*密码 */
  password: string;
}

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
export interface UserResponseData {
  id: number;
  sort: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  account: string;
  nickName: string;
  email: string;
  phone: string;
  sex: string;
  avatar: string;
  roles: any;
}
