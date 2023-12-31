import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
const baseUrl = PORT3 + "/sys_power";
// 获取角色权限
export const getIdPower = (id: number) => {
  return http.get(`${baseUrl}/${id}`);
};
// 修改角色权限
export const setPower = (id: string, params: any) => {
  return http.put(`${PORT3}/sys_role/edit/${id}`, params);
};
