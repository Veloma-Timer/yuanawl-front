import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
import { HomeSet } from "@/api/interface";
const baseUrl: string = PORT3 + "/sys_analysis";
const baseOrder: string = PORT3 + "/base_work_order";
// 获取销售额度
export const getHomeList = (params: any) => {
  return http.get<HomeSet.Home>(`${baseUrl}/home`, params, { noLoading: true });
};

// 获取首页销售 平台销售额排名
export const homeOrder = (params: any) => {
  return http.get(baseOrder, params, { noLoading: true });
};
