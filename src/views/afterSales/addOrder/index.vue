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
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <div class="first-header">
        <Header title="基本信息" class="header basic"></Header>
        <el-button type="primary" @click="edit" class="edit-btn" style="width: 112px"> 编辑 </el-button>
      </div>
      <el-row class="row-line" :gutter="10">
        <el-col :span="6">
          <el-form-item label="游戏账号" prop="accountId">
            <el-select v-model="drawerProps.row!.accountId" placeholder="请选择" class="order-input" filterable>
              <template v-for="item in accountList" :key="item.id">
                <el-option :label="item.accountNumber" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="问题类型" prop="insure">
            <el-select v-model="drawerProps.row!.insure" placeholder="请选择" filterable class="order-input">
              <el-option v-for="item in insureList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否在保" prop="insure">
            <el-select v-model="drawerProps.row!.insure" placeholder="请选择" filterable class="order-input">
              <el-option v-for="item in insureList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="处理时效" prop="handleTime">
            <el-input-number
              v-model="drawerProps.row!.handleTime"
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
            <span>张三</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出售时间">
            <span>2023-05-05</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出售渠道">
            <span>交易猫</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单编号">
            <span>DDD123456</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品加价率">
            <span>0.6</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品周转周期">
            <span>5天</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="买家手机号">
            <span>15107384555</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售备注">
            <span>测试测试</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="basic-info">
        <el-col :span="24">
          <el-form-item label="留言" prop="handleResult" :rules="rules.handleResult" label-width="120px">
            <el-input
              placeholder="请输入"
              clearable
              class="small-input"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="add-process" v-if="!isAddProcess">
        <el-button type="primary" @click="addProcess" class="btn">添加处理</el-button>
      </div>
      <template v-for="(item, i) in drawerProps.row?.detail" :key="i">
        <div class="first-header">
          <Header title="工单处理详情" class="header"></Header>
        </div>
        <template v-if="1 === 1">
          <div class="sub-title">售后部门:</div>
          <el-row :gutter="10" style="margin-top: 24px">
            <el-col :span="6">
              <el-form-item
                label="处理客服"
                :prop="'detail.' + i + '.customerServiceId'"
                :rules="rules.customerServiceId"
                label-width="120px"
              >
                <el-select v-model="item.customerServiceId" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in userList" :key="item2.id">
                    <el-option :label="item2.userName" :value="item2.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理时间" :prop="'detail.' + i + '.handleTime'" :rules="rules.handleTime" label-width="120px">
                <el-date-picker
                  v-model="item.handleTime"
                  type="date"
                  placeholder="请选择"
                  class="order-time"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="处理结果"
                :prop="'detail.' + i + '.handleResult'"
                :rules="rules.handleResult"
                label-width="120px"
              >
                <el-select v-model="item.handleResult" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in handleResultList" :key="item2.value">
                    <el-option :label="item2.label" :value="item2.value" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item
                label="通知其他部门"
                :prop="'detail.' + i + '.customerServiceId'"
                :rules="rules.customerServiceId"
                label-width="120px"
              >
                <el-input v-model="drawerProps.row!.handleTime" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="赔付金额" :prop="'detail.' + i + '.handleTime'" :rules="rules.handleTime" label-width="120px">
                <el-input-number v-model="drawerProps.row!.handleTime" placeholder="请输入" class="order-input"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="新密保手机"
                :prop="'detail.' + i + '.handleResult'"
                :rules="rules.handleResult"
                label-width="120px"
              >
                <el-input v-model="drawerProps.row!.handleTime" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="新密码"
                :prop="'detail.' + i + '.handleResult'"
                :rules="rules.handleResult"
                label-width="120px"
              >
                <el-input v-model="drawerProps.row!.handleTime" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-line">
            <el-col :span="6">
              <el-form-item label="备注" :prop="'detail.' + i + '.assets'" :rules="rules.assets" :label-width="120">
                <div class="up-box">
                  <UploadFiles v-model:file-list="item.assets" height="140px" width="140px"></UploadFiles>
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
              <el-form-item
                label="处理客服"
                :prop="'detail.' + i + '.customerServiceId'"
                :rules="rules.customerServiceId"
                label-width="120px"
              >
                <el-select v-model="item.customerServiceId" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in userList" :key="item2.id">
                    <el-option :label="item2.userName" :value="item2.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理时间" :prop="'detail.' + i + '.handleTime'" :rules="rules.handleTime" label-width="120px">
                <el-date-picker v-model="item.handleTime" type="date" placeholder="请选择" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="处理结果"
                :prop="'detail.' + i + '.handleResult'"
                :rules="rules.handleResult"
                label-width="120px"
              >
                <el-select v-model="item.handleResult" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in handleResultList" :key="item2.value">
                    <el-option :label="item2.label" :value="item2.value" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-line">
            <el-col :span="6">
              <el-form-item label="备注" :prop="'detail.' + i + '.assets'" :rules="rules.assets" :label-width="120">
                <div class="up-box">
                  <UploadFiles v-model:file-list="item.assets" height="140px" width="140px"></UploadFiles>
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
              <el-form-item
                label="处理客服"
                :prop="'detail.' + i + '.customerServiceId'"
                :rules="rules.customerServiceId"
                label-width="120px"
              >
                <el-select v-model="item.customerServiceId" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in userList" :key="item2.id">
                    <el-option :label="item2.userName" :value="item2.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理时间" :prop="'detail.' + i + '.handleTime'" :rules="rules.handleTime" label-width="120px">
                <el-date-picker v-model="item.handleTime" type="date" placeholder="请选择" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="处理结果"
                :prop="'detail.' + i + '.handleResult'"
                :rules="rules.handleResult"
                label-width="120px"
              >
                <el-select v-model="item.handleResult" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in handleResultList" :key="item2.value">
                    <el-option :label="item2.label" :value="item2.value" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-line">
            <el-col :span="6">
              <el-form-item
                label="赔付用户金额"
                :prop="'detail.' + i + '.handleTime'"
                :rules="rules.handleTime"
                label-width="120px"
              >
                <el-input-number v-model="drawerProps.row!.handleTime" placeholder="请输入" class="order-input"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="通知其他部门"
                :prop="'detail.' + i + '.customerServiceId'"
                :rules="rules.customerServiceId"
                label-width="120px"
              >
                <el-input v-model="drawerProps.row!.handleTime" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="给用户换号"
                :prop="'detail.' + i + '.handleResult'"
                :rules="rules.handleResult"
                label-width="120px"
              >
                <el-input v-model="drawerProps.row!.handleTime" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="sub-title">账号销售信息:</div>
          <el-row class="basic-info">
            <el-col :span="6">
              <el-form-item label="出售人姓名">
                <span>张三</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出售时间">
                <span>2023-05-05</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出售渠道">
                <span>交易猫</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单编号">
                <span>DDD123456</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品加价率">
                <span>0.6</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品周转周期">
                <span>5天</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="买家手机号">
                <span>15107384555</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="销售备注">
                <span>测试测试</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-line">
            <el-col :span="6">
              <el-form-item label="备注" :prop="'detail.' + i + '.assets'" :rules="rules.assets" :label-width="120">
                <div class="up-box">
                  <UploadFiles v-model:file-list="item.assets" height="140px" width="140px"></UploadFiles>
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
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit" class="ok">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { SalesOrder } from "@/api/interface";
import UploadFiles from "@/components/Upload/Files.vue";
import Header from "@/components/Header/index.vue";
import { detailSalesList } from "@/api/modules/order";
import { getAllBranch, getAllBaseAccount } from "@/api/modules/set";
import { getAllUser } from "@/api/modules/set";
import { findFileType } from "@/utils";
import { useRouter } from "vue-router";
// import { useAuthButtons } from "@/hooks/useAuthButtons";

// const { BUTTONS } = useAuthButtons();
const router = useRouter();

const rules = reactive({
  orderCode: [{ required: true, message: "必填项不能为空" }],
  customerService: [{ required: true, message: "必填项不能为空" }],
  submitTime: [{ required: true, message: "必填项不能为空" }],
  handleTime: [{ required: true, message: "必填项不能为空" }],
  customerServiceId: [{ required: true, message: "必填项不能为空" }],
  handleResult: [{ required: true, message: "必填项不能为空" }],
  submitOrderTime: [{ required: true, message: "必填项不能为空" }],
  assets: [{ required: true, message: "必填项不能为空" }],
  username: [{ required: true, message: "必填项不能为空" }],
  reportPersonId: [{ required: true, message: "必填项不能为空" }],
  accountId: [{ required: true, message: "必填项不能为空" }],
  newHandleResult: [{ required: true, message: "必填项不能为空" }],
  handleTimes: [{ required: true, message: "必填项不能为空" }],
  insure: [{ required: true, message: "必填项不能为空" }],
  newHandleId: [{ required: true, message: "必填项不能为空" }],
  recycleBranchId: [{ required: true, message: "必填项不能为空" }],
  orderStar: [{ required: true, message: "必填项不能为空" }],
  newHandleTime: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  submitOrderTime?: Date | null;
  title: string;
  isView: boolean;
  row: Partial<SalesOrder.ResSalesList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  submitOrderTime: null,
  isView: false,
  title: "",
  row: {}
});

// 返显数据处理
const getDetailInfo = async (id: any) => {
  if (!id) {
    return false;
  }
  const { data } = await detailSalesList(id);
  if (data) {
    drawerProps.value.row = {
      ...data
    };
    drawerProps.value.row.detail = data?.detail?.map(item => {
      return {
        ...item,
        assets: item.assets.map((imgItem: any) => {
          return {
            path: imgItem.path,
            url: imgItem.path,
            id: imgItem.id,
            type: findFileType(imgItem.path)
          };
        })
      };
    });
  }
};

type UserObj = { userName: string; id: number };
const userList = ref<UserObj[]>([]);
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerProps.value.row.handleTime = 5;
  getDetailInfo(params.row.id);
  const { data } = await getAllUser({});
  userList.value = data;
  drawerVisible.value = true;
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
    if (!valid) return;
    try {
      const {
        id,
        orderCode,
        accountId,
        accountPrice,
        userCompensationPrice,
        platformCompensationPrice,
        reportPersonId,
        insure,
        recycleBranchId,
        handleTime,
        orderStar,
        branchId,
        detail
      } = drawerProps.value.row;
      const newDetail = detail?.map(item => {
        return {
          customerServiceId: item.customerServiceId,
          handleTime: item.handleTime,
          handleResult: item.handleResult,
          assets: item.assets.map((imgItem: any) => {
            return {
              path: imgItem?.response?.path || imgItem.url || imgItem.path,
              id: imgItem.id || imgItem.uid
            };
          })
        };
      });
      await drawerProps.value.api!({
        id,
        orderCode,
        accountId,
        accountPrice,
        userCompensationPrice,
        platformCompensationPrice,
        reportPersonId,
        insure,
        recycleBranchId,
        handleTime,
        orderStar,
        branchId,
        detail: newDetail
      });
      ElMessage.success({ message: `操作成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const goBack = () => {
  router.go(-1);
};

const edit = () => {
  drawerProps.value.isView = false;
  console.log("编辑");
};
const isAddProcess = ref(false);

const addProcess = () => {
  try {
    if (!drawerProps.value.row.detail) {
      drawerProps.value.row.detail = [];
    }
    drawerProps.value.row.detail.push({
      customerServiceId: "",
      handleTime: "",
      handleResult: "",
      assets: []
    });
    isAddProcess.value = true;
  } catch (error) {
    console.log("添加处理", error);
  }
};

defineExpose({
  acceptParams
});
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
