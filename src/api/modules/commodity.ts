import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
const baseUrl: string = PORT3 + "/base_account";
// 获取账户汇总列表
export const summaryList = (params: any) => {
  return http.get(`${baseUrl}`, params);
};
