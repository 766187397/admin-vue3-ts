import { defineStore } from "pinia";
import * as tus from "tus-js-client";
import { deleteTempFile } from "@/api/file";
import { ElMessage } from "element-plus";

export const useLargeFilesStore = defineStore(
  "largeFiles",
  () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    // tus实例
    const currentUpload = ref<tus.Upload | null>(null);
    // 上传进度值
    const progress = ref<string>("0");
    // 上传状态
    const isUploading = ref(false);

    /** 上传文件 */
    const upload = (file: File, hash: string = "") => {
      return new Promise((resolve, reject) => {
        progress.value = "0";
        isUploading.value = true;
        currentUpload.value = null;

        bindUnloadPrompt();
        // 创建 tus 上传实例
        currentUpload.value = new tus.Upload(file, {
          endpoint: `${BASE_URL}/api/v1/large/files/`, // 最后的"/"是必须的
          metadata: {
            filename: file.name,
            filetype: file.type,
            hash,
          },
          retryDelays: [0, 1000, 3000, 5000],
          onError: function (error) {
            progress.value = "0";
            isUploading.value = false;
            currentUpload.value = null;
            ElMessage({
              message: error.message,
              type: "error",
            });
            destroyUnloadPrompt();

            reject(error);
          },
          onProgress: function (bytesUploaded, bytesTotal) {
            progress.value = ((bytesUploaded / bytesTotal) * 100).toFixed(0);
          },
          onSuccess: function (e) {
            if (currentUpload.value) {
              const segments = (currentUpload.value.url as string).split("/");
              const fileId = segments[segments.length - 1];
              const file = currentUpload.value.file;
              const extension = file.name.split(".").pop();
              ElMessage({
                message: "上传成功，请在文件管理中查看。",
                type: "success",
              });
              progress.value = "0";
              isUploading.value = false;
              currentUpload.value = null;
              destroyUnloadPrompt();

              resolve(true);
            }
          },
        });

        // 启动上传
        currentUpload.value.start();
      });
    };

    /** 暂停 */
    const pause = () => {
      if (currentUpload.value) {
        currentUpload.value.abort();
        isUploading.value = false;
      }
    };

    /** 继续上传 */
    const proceed = () => {
      if (currentUpload.value) {
        isUploading.value = true;
        currentUpload.value.start();
      }
    };

    /** 取消上传 */
    const cancel = async () => {
      if (currentUpload.value) {
        destroyUnloadPrompt();
        try {
          currentUpload.value.abort();
          const segments = (currentUpload.value.url as string).split("/");
          const fileId = segments[segments.length - 1];
          await deleteTempFile(fileId);
          progress.value = "0";
          isUploading.value = false;
          currentUpload.value = null;
        } catch (error) {
          console.log("error", error);
        }
      }
    };

    /** 浏览器自带关闭拦截 */
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading.value) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    /** 绑定浏览器自带关闭拦截 */
    const bindUnloadPrompt = () => {
      window.addEventListener("beforeunload", handleBeforeUnload);
    };

    /** 销毁拦截函数 */
    const destroyUnloadPrompt = () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

    return {
      currentUpload,
      progress,
      isUploading,
      upload,
      pause,
      proceed,
      cancel,
    };
  },
  {
    persist: true,
  }
);
