import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import router from "@/router/index";
import { ElMessage } from "element-plus";

/** 使用type来定义请求配置 方便设置联合类型 */
type HttpConfig = AxiosRequestConfig & {
  headers?: {
    /** 平台 */
    platform?: string;
    /** token */
    Authorization?: string;
    /** 刷新token */
    refresh_token?: string;
    /** 是否跳过全局错误处理 */
    skipErrorHandler?: boolean;
    /** 响应不过滤 */
    noResFilter?: boolean;
  };
};

interface InitHttp {
  baseUrl?: string;
  timeout?: number;
  handleError?: (error: any) => void;
}

export class Http {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private requestsQueue: Array<{
    config: any;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];
  private handleError: (error: any) => void = (error) => {
    console.log("error :>> ", error);
  };
  constructor({ baseUrl = "", timeout = 10000, handleError }: InitHttp) {
    if (handleError) {
      this.handleError = handleError;
    }
    this.instance = this.createHttp({ baseUrl, timeout });
    this.requestInterceptors();
    this.responseInterceptors();
  }

  // 请求拦截器
  private requestInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么
        // 标识平台
        config.headers.platform = "web";
        // 添加token
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = token.startsWith("Bearer ")
            ? token
            : localStorage.getItem("token_type") || "Bearer " + token;
        }
        // 刷新token
        const refresh_token = localStorage.getItem("refresh_token");
        if (refresh_token) {
          config.headers.refresh_token = refresh_token.startsWith("Bearer ")
            ? refresh_token
            : localStorage.getItem("token_type") || "Bearer " + refresh_token;
        }
        // 默认使用全局的错误处理
        if (!config.headers.skipErrorHandler) {
          config.headers.skipErrorHandler = false;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截器
  private responseInterceptors() {
    this.instance.interceptors.response.use(
      (response) => {
        if (response.config.headers.noResFilter) {
          return response;
        }
        return response.data;
      },
      async (error) => {
        console.log("error", error);
        const originalRequest = error.config;
        // 如果是401错误且不是刷新token的请求
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/refresh/token")
        ) {
          if (this.isRefreshing) {
            // 如果正在刷新token，将请求加入队列
            return new Promise((resolve, reject) => {
              this.requestsQueue.push({
                config: originalRequest,
                resolve,
                reject,
              });
            });
          }

          this.isRefreshing = true;
          originalRequest._retry = true;

          try {
            // 尝试刷新token
            const response = await this.instance.get("/api/v1/admin/users/refresh/token");
            const newToken = response.data.access_token;

            // 更新token
            localStorage.setItem("token", newToken);

            // 更新当前请求的token
            originalRequest.headers.Authorization = newToken.startsWith("Bearer ")
              ? newToken
              : "Bearer " + newToken;

            // 重试队列中的所有请求
            this.requestsQueue.forEach(({ config, resolve }) => {
              config.headers.Authorization = newToken.startsWith("Bearer ") ? newToken : "Bearer " + newToken;
              resolve(this.instance(config));
            });

            // 清空队列
            this.requestsQueue = [];

            // 重试当前请求
            return this.instance(originalRequest);
          } catch (refreshError) {
            // 刷新token失败
            localStorage.removeItem("token");

            // 拒绝队列中的所有请求
            this.requestsQueue.forEach(({ reject }) => {
              reject(refreshError);
            });

            // 清空队列
            this.requestsQueue = [];

            router.push("/login");
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }
        if (error.code === "ERR_NETWORK") {
          console.log("网络异常！");
          router.push({ name: "error", params: { errorCode: 500, errorMessage: "服务器网络异常！" } });
        }
        // 全局的错误处理
        else if (!error.config.headers.skipErrorHandler) {
          this.handleError(error);
        }
        return Promise.reject(error);
      }
    );
  }

  private createHttp({ baseUrl, timeout }: { baseUrl: string; timeout: number }) {
    return axios.create({
      baseURL: baseUrl,
      timeout: timeout,
    });
  }

  public get<T>(url: string, params?: any, config?: HttpConfig): Promise<T> {
    return this.instance.get(url, {
      params: params,
      ...config,
    });
  }
  public post<T>(url: string, data?: any, config?: HttpConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }
  public delete<T>(url: string, config?: HttpConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
  public patch<T>(url: string, data?: any, config?: HttpConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }
}
const handleError = (error: any) => {
  ElMessage({
    message: error.response?.data?.message || error.message || "未知错误",
    type: "error",
    duration: 5 * 1000,
  });
};
const baseUrl = import.meta.env.VITE_BASE_URL;
const timeout = Number(import.meta.env.VITE_TIMEOUT);
export const http = new Http({ baseUrl, timeout, handleError });
