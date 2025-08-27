import type { Base, PageQueryParams, QueryParams, Static } from "./public";
// Required  转换为必选
// Partial  转换为可选

type File = Base & {
  /** 文件名称 */
  fileName: string;
  /** 文件路径 */
  url: string;
  /** 文件大小 */
  size: number;
  /** 文件完整路径 */
  completePath: string;
};

/** 不分页查询 */
export type FileParams = QueryParams & {
  /** 文件名称 */
  fileName?: string;
};

/** 分页查询 */
export type FilePageParams = FileParams & PageQueryParams;

/** 文件详情 */
export type FileDetail = Required<File> & Static;

/** 秒传参数 */
export interface FileUploadSecondParams {
  /** 文件hash值 */
  hash: string;
  /** 文件大小 */
  size: number | string;
}
