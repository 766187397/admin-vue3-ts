<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      style="overflow-y: hidden"
      :style="{ height: height }"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated" />
  </div>
</template>

<script setup lang="ts">
  import "@wangeditor/editor/dist/css/style.css"; // 引入 css
  import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
  import type { IEditorConfig } from "@wangeditor/editor";
  import { ElMessage } from "element-plus";
  import { uploadFile } from "@/api/file";

  type UploadImageFnType = (url: string, alt: string, href: string) => void;
  type UploadVideoFnType = (url: string, poster: string) => void;

  const editorRef = shallowRef();
  const toolbarConfig = {};
  const mode = "default";

  const { height = "300px" } = defineProps<{
    height?: string;
  }>();
  const valueHtml = defineModel<string>({ default: "" });
  const editorConfig: IEditorConfig = {
    placeholder: "请输入内容...",
    scroll: true,
    readOnly: false,
    autoFocus: false,
    customAlert: (s: string, t: string) => {
      switch (t) {
        case "success":
          ElMessage.success(s);
          break;
        case "info":
          ElMessage.info(s);
          break;
        case "warning":
          ElMessage.warning(s);
          break;
        case "error":
          ElMessage.error(s);
          break;
        default:
          ElMessage.info(s);
          break;
      }
    },
    MENU_CONF: {
      uploadImage: {
        async customUpload(file: File, insertFn: UploadImageFnType) {
          console.log("file", file);
          // insertFn(url, alt, href);
          const data = new FormData();
          data.append("file", file);
          const res = await uploadFile(data);
          console.log("res", res);
          const {
            data: { completePath: url, fileName: alt, completePath: href },
          } = res;
          insertFn(url, alt, href);
        },
      },
      uploadVideo: {
        async customUpload(file: File, insertFn: UploadVideoFnType) {
          console.log("file", file);
          // insertFn(url, poster);
        },
      },
    },
  };

  const handleCreated = (editor: any) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
  };
</script>

<style lang="scss" scoped>
  .w-e-full-screen-container {
    z-index: 10000;
  }
</style>
