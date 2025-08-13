<template>
  <div ref="editorContainer" class="editor"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from "vue";
import * as monaco from "monaco-editor";

// 定义 props 和 emits
const props = defineProps({
  modelValue: {
    type: String,
    default: "", // 默认值为空字符串
  },
  language: {
    type: String,
    default: "html", // 默认值为 'html'
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void; // 用于更新 modelValue
}>();

const editorContainer = ref<HTMLElement | null>(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
  if (editorContainer.value) {
    editorInstance = monaco.editor.create(editorContainer.value, {
      value: props.modelValue, // 使用 modelValue
      language: props.language,
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
      tabSize: 2,
      insertSpaces: true,
    });

    // 监听编辑器内容变化，并更新到外部
    editorInstance.onDidChangeModelContent(() => {
      if (editorInstance) {
        emit("update:modelValue", editorInstance.getValue()); // 更新 modelValue
      }
    });
  }
});

// 如果 props.modelValue 发生变化，则更新编辑器内容
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorInstance && editorInstance.getValue() !== newValue) {
      editorInstance.setValue(newValue);
    }
  }
);

onUnmounted(() => {
  editorInstance?.dispose();
});
</script>

<style scoped>
.editor {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 20px 20px 26px #cacaca, -20px -20px 26px #f6f6f6;
  overflow: hidden;
  /* border: 1px solid #ddd; */
}
</style>
