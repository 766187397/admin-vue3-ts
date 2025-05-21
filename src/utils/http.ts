import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export class Http {
  private instance: AxiosInstance;
  constructor({ baseUrl = "http://localhost:3000", timeout = 10000 }: { baseUrl?: string; timeout?: number } = {}) {
    this.instance = this.createHttp({ baseUrl, timeout });
    this.requestInterceptors();
  }

  // 请求拦截器
  private requestInterceptors() {
    this.instance.interceptors.request.use(function (config) {
      // 在发送请求之前做些什么
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = token.startsWith("Bearer ") ? token : "Bearer " + token;
        config.headers.platform = "web";
      }
      return config;
    });
  }

  // 响应拦截器
  private responseInterceptors() {
    this.instance.interceptors.response.use(
      function (response) {
        return response.data;
      },
      function (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("token");
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

  public get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, {
      params: params,
      ...config,
    });
  }
  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public delete<T>(url: string, config?: any): Promise<T> {
    return this.instance.delete(url, config);
  }
  public patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }
}

export const http = new Http();
