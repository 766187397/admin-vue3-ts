/** 字典接口 */
import { http } from "@/utils/http";
import type { PageApiResult, Result } from "@/types/api";
import type {
  DictionaryCreateParams,
  DictionaryDetail,
  DictionaryItemCreate,
  DictionaryItemUpdate,
  DictionaryUpdateParams,
  GetDictionaryAllParams,
  GetDictionaryItemAllParams,
  GetDictionaryItemAllResult,
  GetDictionaryItemPageParams,
  GetDictionaryPageParams,
} from "@/types/dictionary";

//#region 字典分类接口
/** 创建字典分类 */
export const createDictionary = (data: DictionaryCreateParams): Promise<Result<DictionaryDetail>> => {
  return http.post("/api/v1/admin/dictionary/create", data);
};

/** 更新字典分类 */
export const updateDictionary = (id: string, data: DictionaryUpdateParams): Promise<Result<null>> => {
  return http.patch(`/api/v1/admin/dictionary/update/${id}`, data);
};

/** 无分页获取字典分类 */
export const getDictionaryAll = async (params: GetDictionaryAllParams): Promise<Result<DictionaryDetail[]>> => {
  return http.get("/api/v1/admin/dictionary/all", params);
};

/** 分页获取字典所有分类 */
export const getDictionaryPage = async (
  params: GetDictionaryPageParams
): Promise<Result<PageApiResult<DictionaryDetail[]>>> => {
  return http.get("/api/v1/admin/dictionary/page", params);
};

/** 查询字典分类详情 */
export const getDictionaryDetail = async (id: string): Promise<Result<DictionaryDetail>> => {
  return http.get(`/api/v1/admin/dictionary/info/${id}`);
};

/** 删除字典分类 */
export const deleteDictionary = async (id: string): Promise<Result<null>> => {
  return http.delete(`/api/v1/admin/dictionary/delete/${id}`);
};

//#endregion

//#region 字典项
/** 创建字典项 */
export const createDictionaryItem = async (data: DictionaryItemCreate): Promise<Result<GetDictionaryItemAllResult>> => {
  return http.post(`/api/v1/admin/dictionaryItem/create`, data);
};

/** 更新字典项 */
export const updateDictionaryItem = async (id: string, data: DictionaryItemUpdate): Promise<Result<null>> => {
  return http.patch(`/api/v1/admin/dictionaryItem/update/${id}`, data);
};

/** 字典项分页查询 */
export const getDictionaryItemPage = async (
  data: GetDictionaryItemPageParams
): Promise<Result<GetDictionaryItemAllResult[]>> => {
  return http.get(`/api/v1/admin/dictionaryItem/page`, data);
};

/** 查询所有字典项 */
export const getDictionaryItemAll = async (
  data: GetDictionaryItemAllParams
): Promise<Result<PageApiResult<GetDictionaryItemAllResult[]>>> => {
  return http.get(`/api/v1/admin/dictionaryItem/all`, data);
};

/** 查询字典项详情 */
export const getDictionaryItemDetail = async (id: string): Promise<Result<GetDictionaryItemAllResult>> => {
  return http.get(`/api/v1/admin/dictionaryItem/detail/${id}`);
};

//#endregion
