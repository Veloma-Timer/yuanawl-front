import { ResPage, SalesOrder } from "@/api/interface/index";
import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
/**
 * @name 售后模块
 */
// 售后工单汇总表格
export const getSalesList = (params: any) => {
  return http.get<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order`, params);
};

// 售后工单汇总表格
export const getSalesListToday = (params: any) => {
  return http.get<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order/today`, params);
};

// 售后工单新增工单
export const addSalesList = (params: any) => {
  return http.post<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order`, params);
};

// 售后工单修改工单
export const editSalesList = (params: any) => {
  return http.put<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order/${params.id}`, params);
};

// 售后工单详情
export const detailSalesList = (params: any) => {
  return http.get<SalesOrder.ResSalesList>(`${PORT3}/base_work_order/${params}`);
};

// 售后工单审核
export const checkSalesOrder = (id: number, params: any) => {
  return http.put<SalesOrder.ResSalesList>(`${PORT3}/base_work_order/${id}`, params);
};

// 售后工单审核
export const delSalesOrder = (id: number) => {
  return http.delete(`${PORT3}/base_work_order/${id}`);
};

// 售后工单处理报表-数据统计
export const sysAnalysisWork = (id: number) => {
  return http.get<SalesOrder.WorkReport>(`${PORT3}/sys_analysis/work?branchId=${id}`);
};
