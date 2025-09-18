import router from "@/router/index";
import { ElMessage } from "element-plus";
import { Http } from "@/utils/http";
/** 通用错误处理 */
const handleError = (error: any) => {
  ElMessage({
    message: error.response?.data?.message || error.message || "未知错误",
    type: "error",
    duration: 5 * 1000,
  });
};

/** 网络错误处理 */
const handleErrorNetwork = (error: any) => {
  router.push({ name: "error", params: { errorCode: 500, errorMessage: "服务器网络异常！" } });
};

/** 刷新token失效处理 */
const handleTokenInvalidation = () => {
  router.push("/login");
};

const baseUrl = import.meta.env.VITE_BASE_URL;
const timeout = Number(import.meta.env.VITE_TIMEOUT);
export const http = new Http({ baseUrl, timeout, handleError, handleErrorNetwork, handleTokenInvalidation });
