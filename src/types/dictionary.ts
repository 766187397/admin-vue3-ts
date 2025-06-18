import type { Base, Static } from "./public";

type Dictionary = Base & {
  label: string;
  value: string;
  description: string;
};

/** 无分页查询字典项 */
export interface GetDictionaryItemAllParams {
  sort?: string;
  status?: string;
  time?: string;
  label?: string;
  categoryId?: string;
  type?: string;
}

/** 无分页查询字典项返回结果 */
export type GetDictionaryItemAllResult = Dictionary & Static;
