<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated" />
  </div>
</template>

<script setup lang="ts">
  import "@wangeditor/editor/dist/css/style.css"; // 引入 css
  import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

  const editorRef = shallowRef();
  const toolbarConfig = {};
  const mode = "default";

  const valueHtml = defineModel<string>({ default: "" });

  const editorConfig = { placeholder: "请输入内容..." };
  const handleCreated = (editor: any) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
  };
</script>

<style lang="scss" scoped></style>
