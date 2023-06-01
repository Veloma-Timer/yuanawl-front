import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";
const baseUrl = PORT3 + "/sys_power";
// 获取角色权限
export const getIdPower = (id: string) => {
  return http.get(`${baseUrl}/${id}`);
};
