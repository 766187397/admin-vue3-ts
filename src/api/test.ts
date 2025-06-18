/** 测试接口 */

import { http } from "@/utils/http";

export const test = async () => {
  return await http.get<any>("/api/test");
};
