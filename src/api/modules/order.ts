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

// 售后工单-未完成工单
export const getSalesListUnfinished = (params: any) => {
  return http.get<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order/unfinished`, params);
};

// 售后工单-已完成工单
export const getSalesListFinished = (params: any) => {
  return http.get<ResPage<SalesOrder.ResSalesList>>(`${PORT3}/base_work_order/finished`, params);
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

// 工单处理汇总-右侧看板
export const workOrderAllBoard = (id: number, date: number) => {
  return http.get<SalesOrder.WorkReport>(`${PORT3}/sys_statistics/order/board?branchId=${id}&date=${date}`);
};

// 工单处理汇总-折线图
export const workOrderAllLine = (id: number, date: number) => {
  return http.get<SalesOrder.WorOrderkLine>(`${PORT3}/sys_statistics/order/finished?branchId=${id}&date=${date}`);
};

// 数据统计-销售数据-上边图表的
export const todaySales = (branchId: number, date: number) => {
  // return http.get<Data.TodaySales>(`${PORT3}/sys_analysis/today_sales?branchId=${branchId}&date=${date}`);
  return http.get<Data.TodaySales>(`${PORT3}/sys_statistics/sales?branchId=${branchId}&date=${date}`);
};

// 数据统计-回收数据-上边图表的
export const todayRecycles = (params: any) => {
  const newParams = formatParams(params);
  // return http.get<Data.TodayRecycle>(`${PORT3}/sys_analysis/today_recycle?branchId=${branchId}&date=${date}`);
  return http.get<Data.TodayRecycles>(`${PORT3}/sys_statistics/recycle${newParams}`);
};

// 数据统计-发布数据-下边表格的
export const todayPublishs = (branchId: number, date: number) => {
  // return http.get<ResultData<Data.TodaySales>>(`${PORT3}/base_account/today_sales?branchId=${branchId}`, params);
  return http.get<Data.TodayPublish>(`${PORT3}/sys_statistics/publish?branchId=${branchId}&date=${date}`);
};
// 数据统计-回收数据-下边表格的
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
// 今日公单
export const workOrder = (params: any) => {
  return http.get(`${PORT3}/base_work_order/today`, params);
};

// 数据字典-问题类型
export const getProblemTypes = () => {
  return http.get<Data.ProblemList>(`${PORT3}/sys_map?key=problemTypes`);
};

// 数据字典-处理结果
export const getHandleTypes = () => {
  return http.get<Data.HandleTypeList>(`${PORT3}/sys_map?key=handleTypes`);
};

// 数据字典-部门列表
export const getSetTypes = () => {
  return http.get<Data.SetList>(`${PORT3}/sys_map?key=set`);
};

// 新增工单售后信息
export const addAfterInfo = (params: any) => {
  return http.post(`${PORT3}/base_work_order/after-sales`, params);
};

// 修改工单售后信息
export const editfterInfo = (params: any) => {
  return http.put(`${PORT3}/base_work_order/after-sales`, params);
};

// 新增工单销售信息
export const addSalesInfo = (params: any) => {
  return http.post(`${PORT3}/base_work_order/sales`, params);
};

// 修改工单销售信息
export const editSalesInfo = (params: any) => {
  return http.put(`${PORT3}/base_work_order/sales`, params);
};

// 新增工单发布信息
export const addPublishInfo = (params: any) => {
  return http.post(`${PORT3}/base_work_order/publish`, params);
};

// 新增工单发布信息
export const addRecycleInfo = (params: any) => {
  return http.post(`${PORT3}/base_work_order/recycle`, params);
};

// 修改工单回收信息
export const editRecycleInfo = (params: any) => {
  return http.put(`${PORT3}/base_work_order/recycle`, params);
};

// 修改工单发布信息
export const editPublishInfo = (params: any) => {
  return http.put(`${PORT3}/base_work_order/publish`, params);
};

// 获取当前工单应该处理的部门
export const getProcessingDept = (id: number) => {
  return http.get<{ afterSales: boolean; sales: false; publish: boolean }>(`${PORT3}/base_work_order/processing/dept/${id}`);
};
