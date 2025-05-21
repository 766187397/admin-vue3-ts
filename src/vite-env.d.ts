/// <reference types="vite/client" />

interface ViteTypeOptions {
  // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
  // 这样就不允许有未知的键值了。
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  /** 请求前缀 */
  readonly VITE_BASE_URL: string;
  /** 请求超时时间 */
  readonly VITE_TIMEOUT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
