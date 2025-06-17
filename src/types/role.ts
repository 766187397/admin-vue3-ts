import type { Base, QueryParams, PageQueryParams } from "./public";
// Required  转换为必选
// Partial  转换为可选

// 角色信息
interface Role {
  name: string;
  roleKey: string;
  description: string;
}

/** 创建角色  */
export type RoleCreateParams = {
  /*角色名称 */
  name: string;

  /*角色标识 */
  roleKey: string;

  /*角色描述 */
  description: string;
} & Partial<Role> &
  Base;

/** 更新角色  */
export type RoleUpdateParams = Partial<RoleCreateParams>;

/** 不分页查询角色 */
export interface RoleQuery extends QueryParams {
  name: string;
  roleKey: string;
}

/** 分页查询角色 */
export type RoleQueryParams = RoleQuery & PageQueryParams;

/** 角色详情 */
export type RoleDetail = Base & Role;
