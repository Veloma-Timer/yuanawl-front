import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
const baseUrl = PORT3 + "/sys_role";
// 获取角色列表
export const getRoleLog = (params: any) => {
  return http.get(baseUrl, params);
};
// 新建角色
export const addRole = (params: { id: string }) => {
  return http.post(baseUrl, params);
};
export const editRole = (params: { id: string }) => {
  return http.put(baseUrl, params);
};