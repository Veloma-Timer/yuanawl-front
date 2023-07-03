<template>
  <div class="table-box card">
    <div class="edit-btn" v-if="!isAddProcess">
      <el-button type="primary" @click="goBack" style="width: 112px"> 返回 </el-button>
    </div>
    <el-form
      :class="{ 'rule-form': true, 'rule-form-full': !isAddProcess }"
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="ruleForm.isView"
      :model="ruleForm.row"
      :hide-required-asterisk="ruleForm.isView"
    >
      <div class="first-header">
        <Header title="基本信息" class="header basic"></Header>
        <el-button type="primary" @click="edit" class="edit-btn" style="width: 112px"> 编辑 </el-button>
      </div>
      <el-row class="row-line" :gutter="10">
        <el-col :span="6">
          <el-form-item label="游戏账号" prop="basicAccountId">
            <el-select
              v-model="ruleForm.row!.basicAccountId"
              placeholder="请选择"
              class="order-input"
              filterable
              @change="onChange"
            >
              <template v-for="item in accountList" :key="item.id">
                <el-option :label="item.accountNumber" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="问题类型" prop="basicQuestionType">
            <el-select v-model="ruleForm.row!.basicQuestionType" placeholder="请选择" filterable class="order-input">
              <el-option v-for="item in insureList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否在保" prop="basicInsure">
            <el-select v-model="ruleForm.row!.basicInsure" placeholder="请选择" filterable class="order-input">
              <el-option v-for="item in insureList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="处理时效" prop="basicHandleTime">
            <el-input-number
              v-model="ruleForm.row!.basicHandleTime"
              :min="1"
              :max="5"
              placeholder="请输入"
              class="order-input"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="sub-title">账号销售信息:</div>
      <el-row class="basic-info">
        <el-col :span="6">
          <el-form-item label="出售人姓名">
            <span>{{ ruleForm.row?.basicAccSaleInfoAellerName || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出售时间">
            <span>{{ ruleForm.row?.basicAccSaleInfoSellerTime || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出售渠道">
            <span>{{ ruleForm.row?.basicAccSaleInfoSellerChannel || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单编号">
            <span>{{ ruleForm.row?.basicAccSaleInfoOrderNo || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品加价率">
            <span>{{ ruleForm.row?.basicAccSaleInfoProductMarkupRate || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品周转周期">
            <span>{{
              ruleForm.row?.basicAccSaleInfoProductTurnoverCycle ? ruleForm.row.basicAccSaleInfoProductTurnoverCycle + "天" : "-"
            }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="买家手机号">
            <span>{{ ruleForm.row?.basicAccSaleInfoBuyerPhoneNumber || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售备注">
            <span>{{ ruleForm.row?.basicAccSaleInfoSellerMark || "-" }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="basic-info">
        <el-col :span="24">
          <el-form-item label="留言" prop="basicMessage" label-width="120px">
            <el-input
              v-model="ruleForm.row!.basicMessage"
              placeholder="请输入"
              clearable
              class="small-input"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" prop="baiscAnnex" label-width="120px">
            <UploadFiles v-model:file-list="ruleForm.row!.baiscAnnex" height="140px" width="140px"></UploadFiles>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="add-process" v-if="!isAddProcess">
        <el-button type="primary" @click="addProcess" class="btn">添加处理</el-button>
      </div>
      <template v-if="isAddProcess">
        <div class="first-header">
          <Header title="工单处理详情" class="header"></Header>
        </div>
        <template v-if="1 === 1">
          <div class="sub-title">售后部门:</div>
          <el-row :gutter="10" style="margin-top: 24px">
            <el-col :span="6">
              <el-form-item label="处理客服" prop="AfterCustomerServiceId" label-width="120px">
                <el-select v-model="ruleForm!.row!.AfterCustomerServiceId" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in userList" :key="item2.id">
                    <el-option :label="item2.userName" :value="item2.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理时间" prop="AfterHandleTime" label-width="120px">
                <el-date-picker
                  v-model="ruleForm.row!.AfterHandleTime"
                  type="date"
                  placeholder="请选择"
                  class="order-time"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理结果" prop="AfterHandleResult" label-width="120px">
                <el-select v-model="ruleForm.row!.AfterHandleTime" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in handleResultList" :key="item2.value">
                    <el-option :label="item2.label" :value="item2.value" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="通知其他部门" prop="AfterNotifyOtherDepartments" label-width="120px">
                <el-input v-model="ruleForm.row!.AfterNotifyOtherDepartments" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="赔付金额" prop="AfterCompensationAmount" label-width="120px">
                <el-input-number
                  v-model="ruleForm.row!.AfterCompensationAmount"
                  placeholder="请输入"
                  class="order-input"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="新密保手机" prop="AfterNewSecurityPhone" label-width="120px">
                <el-input v-model="ruleForm.row!.AfterNewSecurityPhone" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="新密码" prop="AfterNewSecurityPassword" label-width="120px">
                <el-input v-model="ruleForm.row!.AfterNewSecurityPassword" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-line">
            <el-col :span="6">
              <el-form-item label="附件" prop="AfterAnnex" :label-width="120">
                <div class="up-box">
                  <UploadFiles v-model:file-list="ruleForm.row!.AfterAnnex" height="140px" width="140px"></UploadFiles>
                  <div class="tip">可添加图片、视频、音频</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-if="2 === 2">
          <div class="sub-title">发布部门:</div>
          <el-row :gutter="10" style="margin-top: 24px">
            <el-col :span="6">
              <el-form-item label="处理客服" prop="publishHandleCustomerServiceId" label-width="120px">
                <el-select
                  v-model="ruleForm.row!.publishHandleCustomerServiceId"
                  placeholder="请选择"
                  class="small-input"
                  filterable
                >
                  <template v-for="item2 in userList" :key="item2.id">
                    <el-option :label="item2.userName" :value="item2.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理时间" prop="publishHandleTime" label-width="120px">
                <el-date-picker v-model="ruleForm.row!.publishHandleTime" type="date" placeholder="请选择" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理结果" prop="publishHandleResult" label-width="120px">
                <el-select v-model="ruleForm.row!.publishHandleResult" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in handleResultList" :key="item2.value">
                    <el-option :label="item2.label" :value="item2.value" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-line">
            <el-col :span="6">
              <el-form-item label="附件" prop="publishAnnex" :label-width="120">
                <div class="up-box">
                  <UploadFiles v-model="ruleForm.row!.publishAnnex" height="140px" width="140px"></UploadFiles>
                  <div class="tip">可添加图片、视频、音频</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-if="3 === 3">
          <div class="sub-title">销售部门:</div>
          <el-row :gutter="10" style="margin-top: 24px">
            <el-col :span="6">
              <el-form-item label="处理客服" prop="saleHandleCustomerService" label-width="120px">
                <el-select v-model="ruleForm.row!.saleHandleCustomerService" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in userList" :key="item2.id">
                    <el-option :label="item2.userName" :value="item2.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理时间" prop="saleHandleTime" label-width="120px">
                <el-date-picker v-model="ruleForm.row!.saleHandleTime" type="date" placeholder="请选择" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理结果" prop="saleHandleResult" label-width="120px">
                <el-select v-model="ruleForm.row!.saleHandleResult" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in handleResultList" :key="item2.value">
                    <el-option :label="item2.label" :value="item2.value" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-line">
            <el-col :span="6">
              <el-form-item label="赔付用户金额" prop="saleCompensationUserAmount" label-width="120px">
                <el-input-number
                  v-model="ruleForm.row!.saleCompensationUserAmount"
                  placeholder="请输入"
                  class="order-input"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="通知其他部门" prop="saleNotifyOtherDepartments" label-width="120px">
                <el-input v-model="ruleForm.row!.saleNotifyOtherDepartments" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="给用户换号" prop="saleChangeUserNumber" label-width="120px">
                <el-input v-model="ruleForm.row!.saleChangeUserNumber" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="sub-title">账号销售信息:</div>
          <el-row class="basic-info">
            <el-col :span="6">
              <el-form-item label="出售人姓名">
                <span>{{ ruleForm.row?.sallerName || "-" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出售时间">
                <span>{{ ruleForm.row!.sallerTime || "-" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出售渠道">
                <span>{{ ruleForm.row?.sallerChannel || "-" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单编号">
                <span>{{ ruleForm.row?.saleAccorderNo || "-" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品加价率">
                <span>{{ ruleForm.row?.saleAccproductMarkupRate || "-" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品周转周期">
                <span>{{
                  ruleForm.row?.saleAccproductTurnoverCycle ? ruleForm.row?.saleAccproductTurnoverCycle + "天" : "-"
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="买家手机号">
                <span>{{ ruleForm.row?.saleAccbuyerPhoneNumber || "-" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="销售备注">
                <span>{{ ruleForm.row?.saleAccsellerMark || "-" }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="附件" prop="saleannex" :label-width="120">
                <div class="up-box">
                  <UploadFiles v-model:file-list="ruleForm.row!.saleannex" height="140px" width="140px"></UploadFiles>
                  <div class="tip">可添加图片、视频、音频</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </template>
    </el-form>
    <div class="foot-btn">
      <el-button @click="goBack" class="cancel">取消</el-button>
      <el-button type="primary" v-show="!ruleForm.isView" @click="handleSubmit" class="ok">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { SalesOrder } from "@/api/interface";
import UploadFiles from "@/components/Upload/Files.vue";
import Header from "@/components/Header/index.vue";
import { addSalesList, editSalesList, detailSalesList } from "@/api/modules/order";
import { getAllBranch, getAllBaseAccount } from "@/api/modules/set";
import { getAllUser } from "@/api/modules/set";
import { findFileType } from "@/utils";
import { useRouter, useRoute } from "vue-router";
// import { useAuthButtons } from "@/hooks/useAuthButtons";

// const { BUTTONS } = useAuthButtons();
const route = useRoute();
const id = route.query.id;
const api = id ? editSalesList : addSalesList;
const router = useRouter();

const rules = reactive({
  basicAccountId: [{ required: true, message: "必填项不能为空" }],
  basicQuestionType: [{ required: true, message: "必填项不能为空" }],
  basicInsure: [{ required: true, message: "必填项不能为空" }],
  basicHandleTime: [{ required: true, message: "必填项不能为空" }],
  basicMessage: [{ required: true, message: "必填项不能为空" }],
  baiscAnnex: [{ required: true, message: "必填项不能为空" }],
  AfterCustomerServiceId: [{ required: true, message: "必填项不能为空" }],
  AfterHandleTime: [{ required: true, message: "必填项不能为空" }],
  AfterHandleResult: [{ required: true, message: "必填项不能为空" }],
  // AfterNotifyOtherDepartments: [{ required: true, message: "必填项不能为空" }],
  // AfterCompensationAmount: [{ required: true, message: "必填项不能为空" }],
  // AfterNewSecurityPhone: [{ required: true, message: "必填项不能为空" }],
  // AfterNewSecurityPassword: [{ required: true, message: "必填项不能为空" }],
  AfterAnnex: [{ required: true, message: "必填项不能为空" }],
  publishHandleCustomerServiceId: [{ required: true, message: "必填项不能为空" }],
  publishHandleTime: [{ required: true, message: "必填项不能为空" }],
  publishHandleResult: [{ required: true, message: "必填项不能为空" }],
  publishAnnex: [{ required: true, message: "必填项不能为空" }],
  saleHandleCustomerService: [{ required: true, message: "必填项不能为空" }],
  saleHandleTime: [{ required: true, message: "必填项不能为空" }],
  saleHandleResult: [{ required: true, message: "必填项不能为空" }],
  // saleCompensationUserAmount: [{ required: true, message: "必填项不能为空" }],
  // saleNotifyOtherDepartments: [{ required: true, message: "必填项不能为空" }],
  // saleChangeUserNumber: [{ required: true, message: "必填项不能为空" }],
  sallerName: [{ required: true, message: "必填项不能为空" }],
  sallerTime: [{ required: true, message: "必填项不能为空" }],
  sallerChannel: [{ required: true, message: "必填项不能为空" }],
  saleannex: [{ required: true, message: "必填项不能为空" }]
});

interface IAddOrder {
  isView: boolean;
  row: Partial<SalesOrder.AddWorkOrder>;
}

const ruleForm = ref<IAddOrder>({
  isView: false,
  row: {}
});

// 返显数据处理
const getDetailInfo = async (id: any) => {
  if (!id) {
    return false;
  }
  const { data } = await detailSalesList(id);
  if (data) {
    ruleForm.value.row = data as unknown as SalesOrder.AddWorkOrder;
    console.log(findFileType);
    // ruleForm.value.row.detail = data?.detail?.map(item => {
    //   return {
    //     ...item,
    //     assets: item.assets.map((imgItem: any) => {
    //       return {
    //         path: imgItem.path,
    //         url: imgItem.path,
    //         id: imgItem.id,
    //         type: findFileType(imgItem.path)
    //       };
    //     })
    //   };
    // });
    // 如果有详情数据 隐藏添加按钮
    // if (ruleForm.value.row.detail.length > 0) {
    //   isAddProcess.value = true;
    // }
  }
};

// 账号状态
const insureList = [
  { label: "否", value: "0" },
  { label: "是", value: "1" }
];

// 处理结果
const handleResultList = [
  { label: "追回", value: "0" },
  { label: "赔钱", value: "1" }
];

// 店铺列表
type BranchObj = { branchName: string; id: number };
const branchList = ref<BranchObj[]>([]);
const getBranchList = async () => {
  const { data } = await getAllBranch({});
  branchList.value = data;
};
getBranchList();

// 账号列表
type AccountObj = { accountNumber: string; id: number };
const accountList = ref<AccountObj[]>([]);
const getAllAccountList = async () => {
  const { data } = await getAllBaseAccount({});
  accountList.value = data;
};
getAllAccountList();

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    console.log("valid", valid, ElMessage, api);
    if (!valid) return;
    try {
      // const {
      //   id,
      //   orderCode,
      //   accountId,
      //   accountPrice,
      //   userCompensationPrice,
      //   platformCompensationPrice,
      //   reportPersonId,
      //   insure,
      //   recycleBranchId,
      //   handleTime,
      //   orderStar,
      //   branchId,
      //   detail
      // } = ruleForm.value.row;
      // const newDetail = detail?.map(item => {
      //   return {
      //     customerServiceId: item.customerServiceId,
      //     handleTime: item.handleTime,
      //     handleResult: item.handleResult,
      //     assets: item.assets.map((imgItem: any) => {
      //       return {
      //         path: imgItem?.response?.path || imgItem.url || imgItem.path,
      //         id: imgItem.id || imgItem.uid
      //       };
      //     })
      //   };
      // });
      // await api!({
      //   id,
      //   orderCode,
      //   accountId,
      //   accountPrice,
      //   userCompensationPrice,
      //   platformCompensationPrice,
      //   reportPersonId,
      //   insure,
      //   recycleBranchId,
      //   handleTime,
      //   orderStar,
      //   branchId,
      //   detail: newDetail
      // });
      // ElMessage.success({ message: `操作成功！` });
    } catch (error) {
      console.log(error);
    }
  });
};

const goBack = () => {
  router.go(-1);
};

const edit = () => {
  ruleForm.value.isView = false;
  console.log("编辑");
};
const isAddProcess = ref(false);

const addProcess = () => {
  isAddProcess.value = true;
};

type UserObj = { userName: string; id: number };
const userList = ref<UserObj[]>([]);

// 回显用户下拉和订单数据
const initOrderData = async () => {
  // 默认时效5
  ruleForm.value.row.basicHandleTime = 5;
  const { data } = await getAllUser({});
  getDetailInfo(id);
  userList.value = data;
};

initOrderData();

// 售后
</script>

<style lang="scss" scoped>
.el-drawer__header {
  position: relative;
  button {
    position: absolute;
    right: 20px;
  }
}
.first-header {
  display: flex;
  position: relative;
  margin-bottom: 20px;
  .basic {
    :deep(.title) {
      padding: 10px 31px;
    }
  }
  .edit-btn {
    position: absolute;
    right: 0;
    top: 5px;
  }
}
.rule-form-full {
  height: 100%;
}
.rule-form {
  padding: 20px;
  :deep(.el-form-item__label) {
    justify-content: flex-center;
  }
  .row-line {
    border-bottom: 1px solid #ebebeb;
  }
  .sub-title {
    font-size: 16px;
    text-align: right;
    color: rgb(42, 42, 42);
    white-space: nowrap;
    letter-spacing: 0px;
    word-break: normal;
    text-align: left;
    margin: 10px 0;
  }
  .basic-info {
    color: #7f7f7f;
    font-size: 14px;
    margin: 10px 0;
  }
  .add-process {
    width: 100%;
    display: flex;
    justify-content: center;
    .btn {
      width: 182px;
      height: 50px;
    }
  }
  .up-box {
    display: flex;
    flex-direction: column;
    color: #dfdfdf;
    .tip {
      margin-top: -10px;
    }
  }
}
.foot-btn {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  z-index: 999;
  .cancel {
    width: 112px;
    height: 38px;
  }
  .ok {
    width: 112px;
    height: 38px;
  }
}
.order-input,
.el-input {
  width: 100% !important;
}
.el-select {
  width: 100% !important;
}
:deep(.el-input__wrapper) {
  width: 100%;
}
.not-data {
  margin-top: 10px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
</style>
