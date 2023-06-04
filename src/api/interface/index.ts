// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    userAccount: string;
    userPassword: string;
  }
  export interface ResLogin {
    access_token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResUser {
    userCode: string; // 用户编码（工号）
    userName: string; // 用户名称
    userTel: string; // 手机号码
    userAccount: string; // 登录账号
    userPassword: string; // 用户密码
    userRoleId: number; // 用户角色ID
    userBranchId: number; // 用户所属门店ID
  }
}

// 售后工单管理模块
export namespace SalesOrder {
  export interface ResSalesList {
    time?: string;
    username: string;
    photo: any[];
    list: any[];
  }
}
// 权限管理模块
export namespace Author {
  export interface RoleList {
    id: string;
    roleName: string;
    powerId: number;
    roleDesc: string;
    isDelete: string;
    createdBy: string;
    createdTime: string;
    updatedBy: string;
    updatedTime: string;
    disabled: "0" | "1";
  }
  export interface RoleObj {
    roleName: string; // 角色名
    powerId: number; // 权限表id
    roleDesc: string; // 角色描述
  }
}
// 设置管理模块
export namespace Set {
  export interface ResSalesList {
    sysModule: string;
    handleType: string;
    handleUser: any;
    branch: any;
    handleRole: any;
    handleTime: string;
    status: string;
    handleStatus: string;
  }

  export interface ResStoreList {
    branchCode: string;
    branchName: string;
  }
  export interface ResAddStore {
    id?: string;
    branchName: string;
    branchCode: string;
    branchContact: { userName: string };
    branchAddress: string;
    branchTel: string;
    branchContactId: number;
  }
}
