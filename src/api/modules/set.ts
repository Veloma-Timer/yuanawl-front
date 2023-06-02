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
  return http.get<{ userName: string; id: number }[]>(PORT3 + `/sys_user/all`, params);
};

// 分页查询门店
export const getAllBranchPage = (params: any) => {
  return http.get(PORT3 + `/sys_branch`, params);
};

// 添加门店
export const addBranch = (params: any) => {
  return http.post(PORT3 + `/sys_branch`, params);
};

// 修改门店
export const editBranch = (params: any) => {
  return http.put(PORT3 + `/sys_branch/${params.id}`, params);
};

// 删除门店
export const delBranch = (params: any) => {
  return http.delete(PORT3 + `/sys_branch/${params.id}`);
};
