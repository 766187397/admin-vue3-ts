import { http } from "@/utils/http";
import type { PageApiResult, Result } from "@/types/api";
import type { LogDetail, LogPageParams } from "@/types/log";

//#region admin
/** 分页查询admin端 */
export const getLogPageAdmin = async (params: LogPageParams): Promise<Result<PageApiResult<LogDetail[]>>> => {
  return await http.get("/api/v1/admin/logger/page/admin", params);
};

//#endregion

//#region web
/** 分页查询web端 */
export const getLogPageWeb = async (params: LogPageParams): Promise<Result<PageApiResult<LogDetail[]>>> => {
  return await http.get("/api/v1/admin/logger/page/web", params);
};

//#endregion
