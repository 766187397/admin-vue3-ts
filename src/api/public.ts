import type { Result } from "@/types/api";
import type { getDictionaryItemAllParams, getDictionaryItemAllResult } from "@/types/dictionary";
import { http } from "@/utils/http";

/** 查询字典项 */
export const getDictionaryItemAll = async (
  params: getDictionaryItemAllParams
): Promise<Result<getDictionaryItemAllResult[]>> => {
  return await http.get("/api/v1/admin/dictionaryItem/all", params);
};
