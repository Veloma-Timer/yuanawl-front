import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";

const baseUrl: string = PORT3 + "/base_account";
// 获取账户汇总列表
export const summaryList = (params: any) => {
  return http.get(`${baseUrl}`, params);
};
// 获取账户汇总列表-历史列表
export const summaryListHistory = (params: any) => {
  return http.get(`${baseUrl}/history_account`, params);
};
// 新增账户
export const addSummary = (params: any) => {
  return http.post(baseUrl, params);
};
// 编辑
export const editSummary = (params: any) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};
// 删除
export const deleteSummary = (params: any) => {
  return http.delete(`${baseUrl}/${params.id}`, params);
};
// 账号模块
export const summaryTemplate = () => {
  return http.get(`${PORT3}/static/template/account.xlsx`, {}, { responseType: "blob" });
};

// 账号导入
export const summaryUpload = (file: FormData) => {
  return http.post(`${baseUrl}/upload`, file);
};

// 账号导出
export const summaryExport = (params: any) => {
  return http.post(`${baseUrl}/export`, params);
};

// 回收列表
export const addRecycle = (params: any) => {
  return http.post(`${baseUrl}/recycle`, params);
};
export const editRecycle = (params: any) => {
  return http.put(`${baseUrl}/recycle`, params);
};
export const getRecycleList = (params: any) => {
  return http.get(`${baseUrl}/recycle`, params);
};
// 销售列表
export const addSales = (params: any) => {
  return http.post(`${baseUrl}/sales`, params);
};
export const editSales = (params: any) => {
  return http.put(`${baseUrl}/sales`, params);
};
export const getSalesList = (params: any) => {
  return http.get(`${baseUrl}/sales`, params);
};

// 发布列表
export const addPublish = (params: any) => {
  return http.post(`${baseUrl}/publish`, params);
};
export const editPublish = (params: any) => {
  return http.put(`${baseUrl}/publish`, params);
};
export const getPublishList = (params: any) => {
  return http.get(`${baseUrl}/publish`, params);
};
export const pointBury = (params: any) => {
  return http.post(`${PORT3}/sys_point_bury`, params);
};
