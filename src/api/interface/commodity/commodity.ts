export namespace Commodity {
  export interface accountClass {
    id: string;
    typeCode: string;
    typeName: string;
  }

  export interface phoneLibrary {
    id: string;
    openAccountName: string;
    openAccountNumber: string;
    bindingTimes: number;
    openAccountTime: string;
  }

  export interface Account {
    id: number;

    accountCode: string; // 账号编码(用户输入，唯一)

    accountType: number; // 账号分类(游戏分类)

    accountTitle: string; // 账号标题

    accountRecyclerId: string; // 回收人

    accountRecyclerTime: string; // 回收时间

    accountRecyclerPrice: number; // 回收价格

    accountPublisherId: number; // 发布人

    accountPublisherTimer: Date; // 发布时间

    accountNumber: string; // 账号

    accountPassword: string; // 密码

    accountTel: string; // 手机号

    accountDesc: string; // 描述

    haveSecondary: string; // 有无二次

    accountRemark: string; // 备注

    accountStatus: number; // 账号状态

    campId: string; // 营地号

    netUpload: number; // 网络上传

    transCatUploaded: number; // 交易猫是否上架

    transCatUid: string; // 交易猫uid'

    accountLevel: string; // 账号等级

    noSaleResidenceTime: number; // 滞留时间(回收时间-当前日期)

    unsoldReason: string; // 未售原因

    salePrice: number; // 出售金额

    salePlatform: string; // 出售平台

    diffPrice: number; // 差值(出售金额-实际回收金额)

    saleResidenceTime: number; // 滞留时间(回收时间-出售时间)

    saleTime: Date; // 出售时间

    isSave: string; // 资料是否存档
    accountPrice: 100.0; // 账号实付金额
    userCompensationPrice: 10.0; // 用户赔付金额
    platformCompensationPrice: 10.0; // 平台赔付金额
    branchId: string; // 门店id
    salePeopleId: string;
  }
}
