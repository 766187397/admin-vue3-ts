/** 创建路由参数 */
export interface createRoutesParams {
  /*排序 */
  sort?: number;

  /*状态；1 - 启用，2 - 禁用；根据模块业务定义 */
  status?: number;

  /*Vue组件路径（物理路径） */
  component?: string;

  /*其他携带信息 */
  meta?: string;

  /*图标 */
  icon?: string;

  /*父级路由id */
  parentId?: number;

  /*是否为外链 */
  externalLinks?: boolean;

  /*重定向地址 */
  redirect?: string;

  /*平台标识（如admin/web/app/mini等） */
  platform?: string;

  /*路由类型：菜单/按钮/API等 */
  type: string;

  /*路由名称 */
  name: string;

  /*路由显示名称 */
  title: string;

  /*前端路由路径（可以含动态参数） */
  path?: string;
}

/** 查询所有路由参数 */
export interface getRoutesAllParams {
  sort?: string;
  status?: string;
  time?: string;
  platform?: string;
  type?: string;
  name?: string;
  title?: string;
}

/** 接口通过角色获取路由 */
export interface RoleRoutes {
  path: string;
  name: string;
  component?: string;
  redirect: string;
  meta: {
    title: string;
    icon: string;
    externalLinks: boolean;
    type: string;
    status: number;
    [key: string]: unknown;
  };
  children?: RoleRoutes[];
}

/** 通过角色查询路由参数 */
export interface getRoutesByRoleParams {
  type: string;
}

/** 详情返回 */
export interface RouterInfo {
  parentId?: number;
  id: number;
  sort: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  type: string;
  name: string;
  title: string;
  path: string;
  component: string;
  meta: string;
  icon: string;
  externalLinks: boolean;
  redirect: string;
  platform?: string;
}

/** 列表返回 */
export interface RoutesList extends RouterInfo {
  children?: RoleRoutes[];
}
