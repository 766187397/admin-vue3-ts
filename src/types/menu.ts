export interface getRoutesParams {
  type: string;
}

/** 接口通过角色获取路由 */
export interface RoleRoutes {
  path: string;
  name?: string;
  component: string;
  redirect?: string;
  meta: {
    title?: string;
    icon?: string;
    externalLinks?: boolean;
    type?: string;
    status?: number;
    [key: string]: unknown;
  };
  children?: RoleRoutes[];
}
