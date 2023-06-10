import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
const baseUrl: string = PORT3 + "/sys_analysis";

// 获取销售额度
export const getHomeList = (params: any) => {
  return http.get(`${baseUrl}/home`, params, { noLoading: true });
};
