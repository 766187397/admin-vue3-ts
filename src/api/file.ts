import { http } from "@/utils/http";
import type { PageApiResult, Result } from "@/types/api";
import type { FileDetail, FileUploadSecondParams } from "@/types/file";

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

/** 文件下载 */
export const downloadFile = async (fileUrl: string, filename?: string): Promise<void> => {
  try {
    let res: any = await http.get(
      `/api/v1/upload/download`,
      { fileUrl },
      {
        responseType: "blob",
        headers: {
          noResFilter: true,
        },
      }
    );
    // 从响应头或 url 里取文件名
    const name =
      filename || decodeURIComponent(res.headers["content-disposition"]?.split("filename=")[1] || "file");
    // 创建临时 URL 并触发下载
    const blob = new Blob([res.data]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // 移除首尾"后端因为浏览器的标准协议的加上的引号，如果保留"那么下载会把首尾的双引号替换为_
    link.download = name.trim().replace(/^["']|["']$/g, "");
    link.click();

    // 释放内存
    URL.revokeObjectURL(link.href);
  } catch (error) {
    http.handleError(error);
  }
};

/** 根据id获取文件 */
export const getFileDetail = async (id: string): Promise<Result<FileDetail>> => {
  return await http.get(`/api/v1/upload/info/${id}`);
};

/** 根据id删除文件 */
export const deleteFile = async (id: string): Promise<Result<null>> => {
  return await http.delete(`/api/v1/upload/delete/${id}`);
};

/** 大文件秒传 */
export const largeFileUploadSecond = async (data: FileUploadSecondParams): Promise<Result<FileDetail>> => {
  return await http.get("/api/v1/large/upload/second", data);
};
