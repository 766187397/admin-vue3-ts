import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import terser from "@rollup/plugin-terser";
import viteCompression from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
        }),
      ],
      imports: ["vue", "vue-router"],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
        }),
      ],
      dts: "src/components.d.ts",
    }),
    (monacoEditorPlugin as any).default({
      languageWorkers: ["editorWorkerService", "typescript", "json", "html"],
    }),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240, // 对大于 10k 的资源才压缩，可按需调整
    }),
    ViteImageOptimizer({
      png: {
        quality: 80, // PNG 压缩质量（0-100）
      },
      jpeg: {
        quality: 75, // JPEG 压缩质量（0-100）
        progressive: true, // 渐进式 JPEG
      },
      webp: {
        quality: 80,
        lossless: false, // 是否无损压缩
      },
      avif: {
        quality: 75, // AVIF 压缩质量
      },
      svg: {
        multipass: true, // 多次优化
        plugins: [
          "removeEmptyAttrs", // 移除空属性
        ],
      },
      include: /\.(png|jpg|jpeg|gif|svg|webp|avif)$/i, // 匹配的文件
      exclude: /node_modules/, // 排除的文件
      cache: true, // 启用缓存，避免重复压缩
      cacheLocation: "node_modules/.vite/image-cache", // 缓存目录
      logStats: true, // 控制台输出压缩统计
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/element-theme.scss" as *;`,
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        terser({
          compress: {
            drop_console: true, // 删除所有 console.* 语句
            drop_debugger: true, // 顺便删除 debugger 语句
          },
        }),
      ],
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.split("node_modules/")[1].split("/")[0];
          }
        },
      },
    },
  },
});
