import { PORT3 } from "@/api/config/servicePort";
import http from "@/api";

// 操作日志列表
export const getOptLog = (params: any) => {
  return http.get(PORT3 + `/sys_logs`, params);
};

// 获取所有门店
export const getAllBranch = (params: any) => {
  return http.get(PORT3 + `/sys_branch/all`, params);
};

// 获取所有角色
export const getAllRole = (params: any) => {
  return http.get(PORT3 + `/sys_role/all`, params);
};

// 获取所有用户
export const getAllUser = (params: any) => {
  return http.get(PORT3 + `/sys_user/all`, params);
};
