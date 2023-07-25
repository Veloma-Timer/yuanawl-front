import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
import { HomeSet } from "@/api/interface";
const baseUrl: string = PORT3 + "/sys_analysis";
const baseOrder: string = PORT3 + "/base_work_order";
// 获取销售额度
export const getHomeList = (params: any) => {
  return http.get<HomeSet.Home>(`${baseUrl}/home`, params, { noLoading: true });
};

export interface IStatistics {
  branchId?: number;
  date?: number;
  userId?: number;
}

// 获取首页数据
export const getHomeStatistics = (params: IStatistics) => {
  return http.get(`${baseUrl}/statistics`, params);
};

// 获取首页工单消息数据
export const getHomeWorkOrders = (params: { date: number; branchId: number; userId: number }): any => {
  return http.get(`${baseUrl}/after_sale`, params);
};

// 个人首页数据
export const getUserProfile = (params: IStatistics) => {
  return http.get(`${baseUrl}/statistics/profile`, params);
};

// 获取首页销售 平台销售额排名
export const homeOrder = (params: any) => {
  return http.get(baseOrder, params, { noLoading: true });
};
// 获取首页销售组&售后组数据对比
export const homeSalesAndAfter = (params: any) => {
  return http.get<HomeSet.ISalesAndAfter>(`${baseUrl}/home/sales_and_after`, params, { noLoading: true });
};
// 获取销售渠道
export const homeSalesChannel = (params: any) => {
  return http.get<HomeSet.ISalesAndAfter>(`${baseUrl}/home/sales_channel`, params, { noLoading: true });
};
// 获取回收渠道
export const homeSalesRecycle = (params: any) => {
  return http.get<HomeSet.ISalesAndAfter>(`${baseUrl}/home/recycle`, params, { noLoading: true });
};
