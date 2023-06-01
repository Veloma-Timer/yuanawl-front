import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";

// 获取用户部门列表
export const getOptLog = (params: any) => {
  return http.get(PORT3 + `/sys_logs`, params);
};
