import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";

const baseUrl: string = PORT3 + "/sys_map";
// 新增分类
export const sellKeyMap = () => {
  return http.get(`${baseUrl}?key=publishPlatform`);
};
// 所谓门店
export const recycleShop = () => {
  return http.get(`${baseUrl}?key=recycleShop`);
};
