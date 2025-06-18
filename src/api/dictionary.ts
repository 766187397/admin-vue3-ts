/** 字典接口 */
import { http } from "@/utils/http";
import type { PageApiResult, Result } from "@/types/api";

/** 创建字典分类 */
export const createDictionary = () => {
  return http.post("/api/v1/admin/dictionary/create");
};
