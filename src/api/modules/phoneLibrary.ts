import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
const baseUrl: string = PORT3 + "/base_tel";
// 新增分类
export const addPhone = (params: any) => {
  return http.post(`${baseUrl}`, params);
};
// 修改分类
export const setPhone = (params: any) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};
// 获取分类列表
export const getPhoneList = (params: any) => {
  return http.get(baseUrl, params);
};

// 删除分类
export const deletePhone = (params: any) => {
  return http.delete(`${baseUrl}/${params.id}`, params);
};
// 手机号模块
export const phoneTemplate = () => {
  return http.get(`/static/template/tel.xlsx`, {}, { responseType: "blob" });
};

// 手机号导入
export const phoneUpload = (file: FormData) => {
  return http.post(`${baseUrl}/upload`, file);
};

// 手机号导出
export const phoneExport = (params: any) => {
  return http.post(`${PORT3}/base_tel/export`, params);
};
