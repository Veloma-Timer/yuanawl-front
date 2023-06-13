import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
import { formatParams } from "@/utils";
const baseUrl: string = PORT3 + "/base_account";
// 获取账户汇总列表
export const summaryList = (params: any) => {
  return http.get(`${baseUrl}`, params);
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
  return http.get(`/static/template/账号模板.xlsx`, {}, { responseType: "blob" });
};

// 账号导入
export const summaryUpload = (file: FormData) => {
  return http.post(`${PORT3}/base_account/upload`, file);
};

// 账号导出
export const summaryExport = (params: any) => {
  return http.post(`${PORT3}/base_account/export`, params);
};
