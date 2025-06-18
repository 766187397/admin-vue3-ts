import type { Base, PageQueryParams, Static } from "./public";
// Required  转换为必选
// Partial  转换为可选

//#region 字典
/** 字典 */
type Dictionary = Base & {
  label: string;
  value: string;
  description: string;
};

/** 字典创建 */
export type DictionaryCreateParams = Dictionary;

/** 字典更新 */
export type DictionaryUpdateParams = Partial<Dictionary>;

/** 字典分类分页查询 */
export interface GetDictionaryAllParams {
  sort?: string;
  status?: string;
  time?: string;
  name?: string;
}

/** 字典分类分页查询 */
export type GetDictionaryPageParams = GetDictionaryAllParams & PageQueryParams;

/** 字典分类详情 */
export type DictionaryDetail = Required<Dictionary> & Required<Static>;

//#endregion

//#region 字典项
type DictionaryItem = Base & {
  /*字典项值描述 */
  description: string;
  /*字典分类id */
  categoryId: string;
  /*字典项名称 */
  label: string;
  /*字典项值 */
  value: string;
};

/** 创建字典项 */
export type DictionaryItemCreateParams = DictionaryItem;

/** 更新字典项 */
export type DictionaryItemUpdateParams = Partial<DictionaryItemCreateParams>;

/** 无分页查询字典项 */
export interface GetDictionaryItemAllParams {
  sort?: string;
  status?: string;
  time?: string;
  label?: string;
  categoryId?: string;
  type?: string;
}

/** 分页查询字典项参数 */
export type GetDictionaryItemPageParams = GetDictionaryItemAllParams & PageQueryParams;

/** 无分页查询字典项返回结果 */
export type GetDictionaryItemAllResult = Dictionary & Static;

//#endregion
