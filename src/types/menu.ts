export interface getRoutesParams {
  type: string;
}

/** 接口通过角色获取路由 */
export interface RoleRoutes {
  path: string;
  name: string;
  component: string;
  meta: any;
  children?: RoleRoutes[];
}
