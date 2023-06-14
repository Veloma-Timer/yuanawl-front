import { ResPage, ResultData, SalesOrder, Data } from "@/api/interface/index";
import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
import { formatParams } from "@/utils/index";
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
  return http.put<SalesOrder.ResSalesList>(`${PORT3}/base_work_order/check/${id}`, params);
};

// 售后工单审核
export const delSalesOrder = (id: number) => {
  return http.delete(`${PORT3}/base_work_order/${id}`);
};

// 售后工单处理报表-数据统计
export const sysAnalysisWork = (id: number, date: number) => {
  return http.get<SalesOrder.WorkReport>(`${PORT3}/sys_analysis/work?branchId=${id}&date=${date}`);
};

// 数据统计-日销售金额汇总-上边图表的
export const todaySales = (branchId: number, date: number) => {
  return http.get<Data.TodaySales>(`${PORT3}/sys_analysis/today_sales?branchId=${branchId}&date=${date}`);
};

// 数据统计-日回收金额汇总-上边图表的
export const todayRecycle = (branchId: number, date: number) => {
  return http.get<Data.TodayRecycle>(`${PORT3}/sys_analysis/today_recycle?branchId=${branchId}&date=${date}`);
};

// 数据统计-日销售金额汇总-下边表格的
export const baseAccountSales = (params: any, branchId: number) => {
  return http.get<ResultData<Data.TodaySales>>(`${PORT3}/base_account/today_sales?branchId=${branchId}`, params);
};
// 数据统计-日回收金额汇总-下边表格的
export const baseAccountRecyle = (params: any, branchId: number) => {
  return http.get<ResultData<Data.TodaySales>>(`${PORT3}/base_account/today_recycle?branchId=${branchId}`, params);
};

// 工单模板
export const orderTemplate = () => {
  return http.get(`/static/template/work_order.xlsx`, {}, { responseType: "blob" });
};

// 工单导入
export const orderUpload = (file: FormData) => {
  return http.post(`${PORT3}/base_work_order/upload`, file);
};

// 工单导出
export const orderExport = (params: any) => {
  const newParams = formatParams(params);
  return http.post(`${PORT3}/base_work_order/export${newParams}`);
};
