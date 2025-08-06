import { http } from "@/utils/http";
import type { PageApiResult, Result } from "@/types/api";
import type { FileDetail } from "@/types/file";

/** 文件上传 */
export const uploadFile = async (data: FormData): Promise<Result<FileDetail>> => {
  return await http.post("/api/v1/upload/file", data, { headers: { "Content-Type": "multipart/form-data" } });
};

/** 获取所有文件列表 */
export const uploadAll = async (): Promise<Result<FileDetail[]>> => {
  return await http.get("/api/v1/upload/all");
};

/** 分页查询文件 */
export const uploadPage = async (params: any): Promise<Result<PageApiResult<FileDetail[]>>> => {
  return await http.get("/api/v1/upload/page", params);
};

/** 根据id获取文件 */
export const getFileDetail = async (id: string): Promise<Result<FileDetail>> => {
  return await http.get(`/api/v1/upload/${id}`);
};

/** 根据id删除文件 */
export const deleteFile = async (id: string): Promise<Result<null>> => {
  return await http.delete(`/api/v1/upload/${id}`);
};

/** 大文件取消上传删除临时文件 */
export const deleteTempFile = async (id: string): Promise<Result<null>> => {
  return await http.delete(`/api/v1/large/tempFile/${id}`);
};
