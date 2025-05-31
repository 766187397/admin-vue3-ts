import { usePublicStore } from "@/store";
import { getDictionaryItemAll } from "@/api/public";

/** 获取初始化的公共数据 */
export default async function initData() {
  const publicStore = usePublicStore();
  const { getFullScreenState, platformList, setPlatformList, publicStateList, setPublicStateList } = publicStore;
  getFullScreenState();
  // 获取平台列表
  if (!platformList || platformList.length === 0) {
    let res = await getDictionaryItemAll({ type: "platform" });
    if (res.code === 200) {
      setPlatformList(res.data);
    }
  }
  // 获取公共状态列表
  if (!publicStateList || publicStateList.length === 0) {
    let res = await getDictionaryItemAll({ type: "publicState" });
    if (res.code === 200) {
      setPublicStateList(res.data);
    }
  }
}
