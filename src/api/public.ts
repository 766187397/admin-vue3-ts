import type { Result } from "@/types/api";
import type { GetDictionaryItemAllParams, GetDictionaryItemAllResult } from "@/types/dictionary";
import { http } from "@/utils/http";

/** 查询字典项 */
export const getDictionaryItemAll = async (
  params: GetDictionaryItemAllParams
): Promise<Result<GetDictionaryItemAllResult[]>> => {
  return await http.get("/api/v1/admin/dictionaryItem/all", params);
};
