// 请求响应参数（不包含data）
export interface Result {
  // code: string;
  // msg: string;
  success: string;
  message: string;
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
    path: string;
    id: number;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    userAccount: string;
    userPassword: string;
  }
  export interface ResLogin {
    data: string;
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
    setId: number; // 用户所在组
  }
}

// 售后工单管理模块
export namespace SalesOrder {
  export interface AccountType {
    accountCode: string;
    accountNumber: number;
  }
  export interface ResSalesList {
    detail: any[];
    id: string;
    accountId: string;
    accountNumber: number;
    reportPersonId: number;
    newHandleId: number;
    orderCheckerId: number;
    branchId: number;
    reason: string;
    username: string;
    accountCode: string;
    accountPrice: string;
    userCompensationPrice: string;
    platformCompensationPrice: string;
    reportPerson: string;
    newHandle: string;
    handleTimes: string;
    newHandleResult: string;
    insure: string;
    recycleBranch: string;
    handleTime: string;
    orderChecker: string;
    checkerResult: string;
    submitOrderTime: string;
    newHandleTime: string;
    orderStatus: string;
    recycleBranchId: number;
    orderStar: number;
    submitTime: string;
    account: AccountType;
    orderCode: string;
  }

  export interface HistogramValue {
    name: string;
    value: number;
  }
  export interface WorkReport {
    handleWorkNumber: {
      today: HistogramValue[];
      yesterday: HistogramValue[];
    };
    workTotal: number;
    addedToday: number;
    passWork: number;
    failedWork: number;
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
// 首页模块
export namespace HomeSet {
  export interface Home {
    totalSales: {
      value: number;
      preValue: string; // 昨日同比
    }; // 今日销售总额
    salesQuantity: {
      value: number;
      preValue: string;
    }; // 今日销售数量
    recyclingQuantity: {
      value: number;
      preValue: string;
    }; // 今日回收数量
    averageSellingPrice: {
      value: number;
      preValue: string;
    }; // 今日销售均价
    recoveryAveragePrice: {
      value: number;
      preValue: string;
    }; // 今日回收均价
    totalRecovery: {
      value: number;
      preValue: string;
    }; // 今日回收总额
    totalSalesVolume: {
      value: number;
    }; // 平台总销售量
    overallRecovery: {
      value: number;
    }; // 平台总回收量
    averageDailyNewSales: {
      value: number;
    }; // 平台日均新增销售量
    dailyAverageNewRecyclingVolume: {
      value: number;
    }; // 平台日均新增回收量
    salesPriceMap: Record<string, number>; // 账号销售占比
    recyclingPriceMap: Record<string, number>; // 账号回收占比
  }
}
