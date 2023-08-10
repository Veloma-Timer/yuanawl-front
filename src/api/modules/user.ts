import { ResPage, User } from "@/api/interface/index";
import { PORT1, PORT3 } from "@/api/config/servicePort";
import http from "@/api";
import { IOptions } from "@/typings";
const baseUrl = PORT3 + "/sys_user";
/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(`api${PORT1}/user/list`, params);
};

// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/tree/list`, params);
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(baseUrl, params);
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(PORT1 + `/user/import`, params);
};

// 编辑用户
export const editUser = (params: { id: string }) => {
  return http.put(`${baseUrl}/${params.id}`, params);
};

// 删除用户
export const deleteUser = (id: number) => {
  return http.delete(baseUrl + `/${id}`);
};

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/user/change`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(PORT1 + `/user/rest_password`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/user/export`, params);
};

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(PORT1 + `/user/status`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender[]>(`/api${PORT1}/user/gender`);
};

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<User.ResDepartment[]>(PORT1 + `/user/department`);
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole[]>(PORT1 + `/user/role`);
};
export const getUserListMap = (params: any) => {
  return http.get(baseUrl, params);
};
export const getUserTree = () => {
  return http.get<User.Tree>(`${baseUrl}/tree`);
};
// 获取所有组的信息
export const getGroupListMap = <T extends string>(params: { key: string }): Promise<{ data: Record<T, IOptions> }> => {
  return http.get(`${PORT3}/sys_map`, params, { noLoading: true });
};
// 获取所有用户
export const getUserAll = () => {
  return http.get(`${baseUrl}/all`, {}, { noLoading: true });
};
// 获取不同部门的用户
export const getDeptUsers = (setId: number) => {
  return http.get(`${baseUrl}/dept`, { setId }, { noLoading: true });
};

// 获取回收用户
export const getRecycleUsers = () => getDeptUsers(1);

// 获取发布用户
export const getPublishUsers = () => getDeptUsers(3);

// 获取销售用户
export const getSalesUsers = () => getDeptUsers(0);

// 获取售后用户
export const getAfterSalesUsers = () => getDeptUsers(2);

// 下载用户模板
export const getUserTemptable = () => {
  return http.get(`/static/template/user.xlsx`, {}, { responseType: "blob" });
};
export const getUserUpload = (file: FormData) => {
  return http.post(`${baseUrl}/upload`, file);
};

export const getUserExport = (params: any) => {
  return http.post(`${baseUrl}/export`, params);
};
