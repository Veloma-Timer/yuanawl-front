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
    isAdmin: number; // 是否为管理员
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
    handleTime: number;
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
      current: HistogramValue[];
      preCurrent: HistogramValue[];
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
    handleDesc: string;
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
  export interface HistogramValue {
    name: string;
    value: number;
  }

  export interface IDataComparison extends HistogramValue {
    number: number; // 数量
  }

  export interface SalasRanking {
    index: number; // 排名
    name: string; // 客服名称
    salas: number; // 销售额
    branch: string; // 店铺名
  }

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
    // 工单占比
    workOrderProp: {
      saleAccountNumber: HistogramValue[]; // 已售账号
      workOrderNumber: HistogramValue[]; // 工单数量
    };
    // 平台销售总额
    platformSalas: { name: string; salas: number }[];
    // 销售额排名
    salasRanking: SalasRanking[];
    // 销售组数据对比 -> 统计销售数据
    salesUnit: IDataComparison[];
    // 回收组数据对比 -> 统计回收数据
    recycleUnit: IDataComparison[];
    // 售后组数据对比 -> 统计售后数据
    afterSaleUnit: IDataComparison[];
    // 发布组数据对比 -> 统计发布数据
    publishUnit: IDataComparison[];
  }
}

// 数据统计
export namespace Data {
  export interface DateRange {
    [key: string]: number;
  }
  export interface keyValue {
    name: string;
    value: number;
  }
  export interface TodaySales {
    salesMap: {
      current: keyValue[];
      preCurrent: keyValue[];
    };
    salesPrice: number;
    arpa: number;
    paidOrders: number;
    buyNumber: number;
  }
  export interface TodayRecycle {
    recycleNumber: {
      current: keyValue[];
      preCurrent: keyValue[];
    };
    recyclePrice: number;
    arpa: number;
    recycleOrders: number;
    buyNumber: number;
  }
  export interface AccountPublisher {
    userName: string;
  }
  export interface SaleList {
    accountCode: string;
    accountType: string;
    accountRecyclerPrice: string;
    salePrice: string;
    accountPublisher: AccountPublisher;
    saleTime: string;
  }
  export interface RecycleList {
    accountCode: string;
    accountType: string;
    accountRecycler: AccountPublisher;
    accountRecyclerTime: string;
    accountStatus: number;
    accountRecyclerPrice: string;
  }
}
// 短信管理
export namespace Message {
  export interface Template {
    signature: string;
    corporateName: string;
    content: string;
    status: string;
    time: string;
    text: string;
    phone: string;
  }
  export interface Sending {
    accountId: string;
    reduction: boolean;
    message: string;
    phones: string[];
    sendingTime: number;
  }
}
