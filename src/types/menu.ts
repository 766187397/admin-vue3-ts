import type { Base, PageQueryParams, Static } from "./public";
// Required  转换为必选
// Partial  转换为可选

type Router = Base & {
  /*Vue组件路径（物理路径） */
  component: string;

  /*其他携带信息 */
  meta: string;

  /*图标 */
  icon: string;

  /*父级路由id */
  parentId: string;

  /*是否为外链 */
  externalLinks: boolean;

  /*重定向地址 */
  redirect: string;

  /*平台标识（如admin/web/app/mini等） */
  platform: string;

  /*路由类型：菜单/按钮/API等 */
  type: string;

  /*路由名称 */
  name: string;

  /*路由显示名称 */
  title: string;

  /*前端路由路径（可以含动态参数） */
  path: string;
};

/** 创建路由参数 */
export type CreateRoutesParams = Partial<Router> & {
  /*路由类型：菜单/按钮/API等 */
  type: string;

  /*路由名称 */
  name: string;

  /*路由显示名称 */
  title: string;
};

/** 查询所有路由参数 */
export interface GetRoutesAllParams {
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
export interface GetRoutesByRoleParams {
  type: string;
}

/** 详情返回 */
type RouterInfo = Router & Static;

/** 路由详情 抽离 防止循环引用 */
export interface RouterInfoList extends RouterInfo {
  children?: RouterInfo[];
  parent?: RouterInfo;
}
