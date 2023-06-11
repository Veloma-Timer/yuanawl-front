import { Login } from "@/api/interface";
import { PORT3 } from "@/api/config/servicePort";
import authMenuList from "@/assets/json/authMenuList.json";
import http from "@/api";
import { UnwrapRef } from "vue";
const baseUrl: string = PORT3 + "/sys_user";
/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: {
  userPassword: UnwrapRef<Login.ReqLoginForm["userPassword"]>;
  password: string;
  userAccount: UnwrapRef<Login.ReqLoginForm["userAccount"]>;
}) => {
  // return http.post<Login.ResLogin>(`/api${PORT1}/login`, params, { noLoading: true }); // 正常 post json 请求  ==>  application/json
  return http.post<string>(baseUrl + "/login", params, { noLoading: true }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { noLoading: true }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  // return http.get<Menu.MenuOptions[]>(PORT3 + `/sys_role/power` + id, {}, { noLoading: true });
  // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 authMenuList.json 数据
  return authMenuList;
};

// 获取按钮权限
export const getAuthButtonListApi = (id: string) => {
  return http.get<Menu.MenuOptions[]>(PORT3 + `/sys_role/power/` + id, {}, { noLoading: true });
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(baseUrl + "/logout");
};
