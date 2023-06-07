import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
const baseUrl: string = PORT3 + "/base_account_type";
// 新增分类
export const addAccout = (params: any) => {
  return http.post(`${baseUrl}`, params);
};
// 修改分类
export const setAccout = (params: any) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};
// 获取分类列表
export const getAccoutList = (params: any) => {
  return http.get(baseUrl, params);
};

// 删除分类
export const deleteAccout = (params: any) => {
  return http.delete(`${baseUrl}/${params.id}`, params);
};
