import type { GetDictionaryItemAllResult } from "@/types/dictionary";
/**
 * 字典显示值
 * @param {GetDictionaryItemAllResult} arr 字典列表
 * @param value 返回的值
 */
export const displayValue = (arr: GetDictionaryItemAllResult[], value: string) => {
  if (!arr || arr.length <= 0 || !value) {
    return "";
  }
  return arr.find((item) => item.value === value)?.label || "";
};
