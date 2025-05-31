import type { Result } from "@/types/api";
import type { getDictionaryItemAllParams, getDictionaryItemAllResult } from "@/types/public";
import { http } from "@/utils/http";

/** 查询字典项 */
export const getDictionaryItemAll = async (
  params: getDictionaryItemAllParams
): Promise<Result<getDictionaryItemAllResult[]>> => {
  return await http.get<Result<getDictionaryItemAllResult[]>>("/api/v1/admin/dictionaryItem/all", params);
};
