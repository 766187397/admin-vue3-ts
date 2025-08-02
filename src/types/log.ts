import type { Base, PageQueryParams, QueryParams, Static } from "./public";
// Required  转换为必选
// Partial  转换为可选

type Log = Base & {
  /** 账号 */
  account: string;
  /** 昵称 */
  nickName: string;
  /** 地址 */
  url: string;
  /** 请求方式 */
  method: string;
  /** 来源 */
  referer: string;
  /** 请求接口平台 */
  apiPlatform: string;
  /** 浏览器设备信息 */
  browser: string;
  /** 耗时 */
  responseTime: string;
  /** 接口返回的json数据 */
  resData: string;
  /** 接口返回的状态码 */
  statusCode: string;
  /** IP 地址 */
  IP: string;
};

/** 详情 */
export type LogDetail = Log;

/** 分页查询 */
export type LogPageParams = PageQueryParams;
