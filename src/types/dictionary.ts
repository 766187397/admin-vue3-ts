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
export interface GetDictionaryItemAllResult {
  id: string;
  sort: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  label: string;
  value: string;
  description: string;
}
