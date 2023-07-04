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
          <el-form-item label="工单编号" prop="basicOrderCode">
            <el-input v-model="ruleForm.row!.basicOrderCode" placeholder="请选择" class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="游戏账号" prop="basicAccountId">
            <el-select
              v-model="ruleForm.row!.basicAccountId"
              placeholder="请选择"
              class="order-input"
              filterable
              @change="onChangeAccount"
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
              <el-option v-for="item in problemTypeList" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-col :span="6">
          <el-form-item label="工单星级" prop="basicOrderStar">
            <el-input-number
              v-model="ruleForm.row!.basicOrderStar"
              :min="1"
              :max="3"
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
            <span>{{ baseObj?.salePeople?.userName || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出售时间">
            <span>{{ baseObj?.saleTime ? dayjs(baseObj.saleTime).format("YYYY-MM-DD HH:mm:ss") : "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出售渠道">
            <span>{{ baseObj?.salePlatformId ? chanelMap[baseObj?.salePlatformId] || "-" : "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单编号">
            <span>{{ baseObj?.accountCode || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品加价率">
            <span>{{ baseObj?.addPriceRate || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品周转周期">
            <span>{{ baseObj?.conversionCycle ? baseObj.conversionCycle + "天" : "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="买家手机号">
            <span>{{ baseObj?.buyerTel || "-" }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售备注">
            <span>{{ baseObj?.salesRemark || "-" }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="basic-info">
        <el-col :span="24">
          <el-form-item label="备注" prop="basicMessage" label-width="120px">
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
              <el-form-item label="处理客服" prop="afterCustomerServiceId" label-width="120px">
                <el-select v-model="ruleForm!.row!.afterCustomerServiceId" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in userList" :key="item2.id">
                    <el-option :label="item2.userName" :value="item2.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理时间" prop="afterHandleTime" label-width="120px">
                <el-date-picker
                  v-model="ruleForm.row!.afterHandleTime"
                  type="date"
                  placeholder="请选择"
                  class="order-time"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="处理结果" prop="afterHandleResult" label-width="120px">
                <el-select v-model="ruleForm.row!.afterHandleResult" placeholder="请选择" class="small-input" filterable>
                  <template v-for="item2 in handleTypeList" :key="item2.id">
                    <el-option :label="item2.label" :value="item2.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <!-- <el-col :span="6">
              <el-form-item label="通知其他部门" prop="afterNotifyOtherDepartments" label-width="120px">
                <el-input v-model="ruleForm.row!.afterNotifyOtherDepartments" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="赔付金额" prop="afterCompensationAmount" label-width="120px">
                <el-input-number
                  v-model="ruleForm.row!.afterCompensationAmount"
                  placeholder="请输入"
                  class="order-input"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="新密保手机" prop="afterNewSecurityPhone" label-width="120px">
                <el-input v-model="ruleForm.row!.afterNewSecurityPhone" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="新密码" prop="afterNewSecurityPassword" label-width="120px">
                <el-input v-model="ruleForm.row!.afterNewSecurityPassword" placeholder="请输入" class="order-input"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="basic-info">
            <el-col :span="24" v-if="ruleForm.row!.afterHandleResult === handleOtherId">
              <el-form-item label="处理结果备注" prop="afterSpecHandleResult" label-width="120px">
                <el-input
                  v-model="ruleForm.row!.afterSpecHandleResult"
                  placeholder="请输入"
                  clearable
                  class="small-input"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="售后备注" prop="afterSalesRemark" label-width="120px">
                <el-input
                  v-model="ruleForm.row!.afterSalesRemark"
                  placeholder="请输入"
                  clearable
                  class="small-input"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-line">
            <el-col :span="6">
              <el-form-item label="附件" prop="afterAnnex" :label-width="120">
                <div class="up-box">
                  <UploadFiles v-model:file-list="ruleForm.row!.afterAnnex" height="140px" width="140px"></UploadFiles>
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
                  <template v-for="item2 in handleTypeList" :key="item2.id">
                    <el-option :label="item2.label" :value="item2.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="row-line">
            <el-col :span="24" v-if="ruleForm.row!.publishHandleResult === handleOtherId">
              <el-form-item label="处理结果备注" prop="publishResultRemark" label-width="120px">
                <el-input
                  v-model="ruleForm.row!.publishResultRemark"
                  placeholder="请输入"
                  clearable
                  class="small-input"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="发布备注" prop="publishRemark" label-width="120px">
                <el-input
                  v-model="ruleForm.row!.publishRemark"
                  placeholder="请输入"
                  clearable
                  class="small-input"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="附件" prop="publishAnnex" :label-width="120">
                <div class="up-box">
                  <UploadFiles v-model:file-list="ruleForm.row!.publishAnnex" height="140px" width="140px"></UploadFiles>
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
                  <template v-for="item2 in handleTypeList" :key="item2.id">
                    <el-option :label="item2.label" :value="item2.id" />
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
          <el-row :gutter="10">
            <el-col :span="24" v-if="ruleForm.row!.saleHandleResult === handleOtherId">
              <el-form-item label="处理结果备注" prop="salesResultRemark" label-width="120px">
                <el-input
                  v-model="ruleForm.row!.salesResultRemark"
                  placeholder="请输入"
                  clearable
                  class="small-input"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="销售备注" prop="salesRemark" label-width="120px">
                <el-input
                  v-model="ruleForm.row!.salesRemark"
                  placeholder="请输入"
                  clearable
                  class="small-input"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                ></el-input>
              </el-form-item>
            </el-col>
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
import {
  addSalesList,
  editSalesList,
  detailSalesList,
  getProblemTypes,
  getHandleTypes,
  addAfterInfo,
  addSalesInfo,
  addPublishInfo
} from "@/api/modules/order";
import { getAllBranch, getAllBaseAccount } from "@/api/modules/set";
import { getAllUser } from "@/api/modules/set";
import { findFileType } from "@/utils";
import { useRouter, useRoute } from "vue-router";
import { sellKeyMap } from "@/api/modules/dictionary";
import dayjs from "dayjs";
// import { useAuthButtons } from "@/hooks/useAuthButtons";

// const { BUTTONS } = useAuthButtons();
const route = useRoute();
const id = route.query.id;
const api = id ? editSalesList : addSalesList;
const router = useRouter();

const rules = reactive({
  basicOrderCode: [{ required: true, message: "必填项不能为空" }],
  basicOrderStar: [{ required: true, message: "必填项不能为空" }],
  basicAccountId: [{ required: true, message: "必填项不能为空" }],
  basicQuestionType: [{ required: true, message: "必填项不能为空" }],
  basicInsure: [{ required: true, message: "必填项不能为空" }],
  basicHandleTime: [{ required: true, message: "必填项不能为空" }],
  basicMessage: [{ required: true, message: "必填项不能为空" }],
  baiscAnnex: [{ required: true, message: "必填项不能为空" }],
  afterCustomerServiceId: [{ required: true, message: "必填项不能为空" }],
  afterHandleTime: [{ required: true, message: "必填项不能为空" }],
  afterHandleResult: [{ required: true, message: "必填项不能为空" }],
  // afterNotifyOtherDepartments: [{ required: true, message: "必填项不能为空" }],
  // afterCompensationAmount: [{ required: true, message: "必填项不能为空" }],
  // afterNewSecurityPhone: [{ required: true, message: "必填项不能为空" }],
  // afterNewSecurityPassword: [{ required: true, message: "必填项不能为空" }],
  afterAnnex: [{ required: true, message: "必填项不能为空" }],
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
  saleannex: [{ required: true, message: "必填项不能为空" }],
  afterSpecHandleResult: [{ required: true, message: "必填项不能为空" }],
  afterSalesRemark: [{ required: true, message: "必填项不能为空" }],
  publishResultRemark: [{ required: true, message: "必填项不能为空" }],
  publishRemark: [{ required: true, message: "必填项不能为空" }],
  salesResultRemark: [{ required: true, message: "必填项不能为空" }],
  salesRemark: [{ required: true, message: "必填项不能为空" }]
});

interface IAddOrder {
  isView: boolean;
  row: Partial<SalesOrder.AddWorkOrder>;
}

const ruleForm = ref<IAddOrder>({
  isView: false,
  row: {}
});

const baseObj = ref();
function onChangeAccount(e: any) {
  const obj = accountList.value.find(item => item.id === e);
  baseObj.value = obj;
  console.log(baseObj.value);
}

// 返显数据处理
const getDetailInfo = async (id: any) => {
  if (!id) {
    return false;
  }
  const { data } = await detailSalesList(id);
  if (data) {
    const afterInfo: any = data.detail.find(item => item.handleDept === 1);
    const saleInfo: any = data.detail.find(item => item.handleDept === 2);
    const publistInfo: any = data.detail.find(item => item.handleDept === 3);
    // 基本
    const basicObj = {
      basicOrderCode: data.orderCode,
      basicAccountId: data.accountId,
      basicQuestionType: data.problemTypeId,
      basicInsure: data.insure,
      basicOrderStar: data.orderStar,
      basicHandleTime: data.handleTime,
      basicMessage: data.remark,
      baiscAnnex: data.assets.map((imgItem: any) => {
        return {
          path: imgItem.path,
          url: imgItem.path,
          id: imgItem.id,
          type: findFileType(imgItem.path)
        };
      })
    };
    // 售后
    let afterObj = {};
    if (afterInfo) {
      afterObj = {
        afterHandleResult: afterInfo.afterSaleResultId,
        afterHandleTime: afterInfo.afterSaleHandleTime,
        afterSpecHandleResult: afterInfo.afterSalesResultRemark,
        afterCompensationAmount: afterInfo.afterSalesCompensationAmount,
        afterNewSecurityPhone: afterInfo.newSecretCellPhone,
        afterNewSecurityPassword: afterInfo.newPassword,
        afterSalesRemark: afterInfo.afterSalesRemark,
        afterCustomerServiceId: afterInfo.afterSaleServiceId,
        afterAnnex: afterInfo.afterSaleAssets?.map((imgItem: any) => {
          return {
            path: imgItem.path,
            url: imgItem.path,
            id: imgItem.id,
            type: findFileType(imgItem.path)
          };
        })
      };
    }
    // 发布
    let publishObj = {};
    if (publistInfo) {
      publishObj = {
        publishHandleCustomerServiceId: publistInfo.publishServiceId,
        publishHandleTime: publistInfo.publishHandleTime,
        publishHandleResult: publistInfo.publishResultId,
        publishResultRemark: publistInfo.publishResultRemark,
        publishRemark: publistInfo.publishRemark,
        publishAnnex: publistInfo.publishAssets?.map((imgItem: any) => {
          return {
            path: imgItem.path,
            url: imgItem.path,
            id: imgItem.id,
            type: findFileType(imgItem.path)
          };
        })
      };
    }
    // 销售
    let saleObj = {};
    if (saleInfo) {
      saleObj = {
        saleHandleCustomerService: saleInfo.salesResultId,
        saleHandleTime: saleInfo.salesHandleTime,
        saleHandleResult: saleInfo.salesResultId,
        saleCompensationUserAmount: saleInfo.salesCompensationAmount,
        saleChangeUserNumber: saleInfo.newAccountId,
        salesResultRemark: saleInfo.salesResultRemark,
        salesRemark: saleInfo.salesRemark,
        saleannex: saleInfo.salesAssets?.map((imgItem: any) => {
          return {
            path: imgItem.path,
            url: imgItem.path,
            id: imgItem.id,
            type: findFileType(imgItem.path)
          };
        })
      };
    }
    ruleForm.value.row = {
      ...basicObj,
      ...afterObj,
      ...publishObj,
      ...saleObj
    } as unknown as SalesOrder.AddWorkOrder;
    // 账号销售数据信息默认
    onChangeAccount(data.accountId);
    // 如果有详情数据 隐藏添加按钮
    if (data.detail.length > 0) {
      isAddProcess.value = true;
    }
  }
};

// 账号状态
const insureList = [
  { label: "否", value: "0" },
  { label: "是", value: "1" }
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

// 数据字典-问题类型
type listTypeObj = { label: string; id: number; value: number };
const problemTypeList = ref<listTypeObj[]>([]);
const getProblemTypesFun = async () => {
  const { data } = await getProblemTypes();
  problemTypeList.value = data.problemTypes;
};
getProblemTypesFun();

// 数据字典-处理结果
const handleTypeList = ref<listTypeObj[]>([]);
const handleOtherId = ref<any>();
const getHandleTypesFun = async () => {
  const { data } = await getHandleTypes();
  handleTypeList.value = data.handleTypes;
  const otherObj = data.handleTypes.find((item: any) => item.label === "其他");
  handleOtherId.value = otherObj.id;
};
getHandleTypesFun();

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    console.log("valid", valid, ElMessage, api);
    if (!valid) return;
    try {
      const {
        basicOrderCode,
        basicAccountId,
        basicQuestionType,
        basicInsure,
        basicHandleTime,
        basicMessage,
        baiscAnnex,
        basicOrderStar,
        afterHandleResult,
        afterSpecHandleResult,
        afterCompensationAmount,
        afterNewSecurityPhone,
        afterNewSecurityPassword,
        afterSalesRemark,
        afterAnnex,
        publishHandleResult,
        publishResultRemark,
        publishRemark,
        publishAnnex,
        saleHandleResult,
        saleCompensationUserAmount,
        saleChangeUserNumber,
        saleannex,
        salesResultRemark,
        salesRemark
      } = ruleForm.value.row;
      const baseData = {
        orderCode: basicOrderCode,
        accountId: basicAccountId,
        problemTypeId: basicQuestionType,
        insure: basicInsure,
        orderStar: basicOrderStar,
        handleTime: basicHandleTime,
        remark: basicMessage,
        assets: baiscAnnex?.map(item => {
          return {
            path: item?.response?.path || item.url || item.path,
            id: item.id || item.uid
          };
        })
      };
      console.log(baseData);
      // 基本信息
      const { data }: any = await api!(baseData);
      // 售后信息
      await addAfterInfo({
        orderId: data.id,
        afterSaleResultId: afterHandleResult, // 售后处理结果
        afterSalesResultRemark: afterSpecHandleResult, // 售后处理结果备注(这个只有当处理结果类型为其他的时候才有)
        afterSalesCompensationAmount: afterCompensationAmount, // 售后赔付金额
        newSecretCellPhone: afterNewSecurityPhone, // 新密保手机
        newPassword: afterNewSecurityPassword, // 新密码
        afterSalesRemark: afterSalesRemark, // 售后备注
        afterSaleAssets: afterAnnex?.map(item => {
          return {
            path: item?.response?.path || item.url || item.path,
            id: item.id || item.uid
          };
        }) // 售后提交资源
      });
      // 发布信息
      await addPublishInfo({
        orderId: data.id, // 工单id
        publishResultId: publishHandleResult, // 发布处理结果
        publishResultRemark: publishResultRemark, // 销售处理结果备注
        publishRemark: publishRemark, // 发布备注
        publishAssets: publishAnnex?.map(item => {
          return {
            path: item?.response?.path || item.url || item.path,
            id: item.id || item.uid
          };
        }) // 发布提交资源
      });
      // 销售信息
      await addSalesInfo({
        orderId: data.id, // 工单id
        salesResultId: saleHandleResult, // 销售处理结果
        salesCompensationAmount: saleCompensationUserAmount, // 赔付用户金额
        newAccountId: saleChangeUserNumber, // 给用户换号: 新账号id
        salesResultRemark: salesResultRemark, // 销售处理结果备注
        salesRemark: salesRemark, // 销售备注
        salesAssets: saleannex?.map(item => {
          return {
            path: item?.response?.path || item.url || item.path,
            id: item.id || item.uid
          };
        }) // 销售提交资源
      });
      ElMessage.success({ message: `操作成功！` });
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

const chanelMap = ref();
async function getChanelMap() {
  const { data }: any = await sellKeyMap();
  const obj: { [key: number]: string } = (data?.publishPlatform || []).reduce(
    (acc: { [x: string]: any }, curr: { value: string | number; label: any }) => {
      acc[curr.value] = curr.label;
      return acc;
    },
    {}
  );
  chanelMap.value = obj;
}
getChanelMap();
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
  position: relative;
  display: flex;
  margin-bottom: 20px;
  .basic {
    :deep(.title) {
      padding: 10px 31px;
    }
  }
  .edit-btn {
    position: absolute;
    top: 5px;
    right: 0;
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
    margin: 10px 0;
    font-size: 16px;
    color: rgb(42 42 42);
    text-align: right;
    text-align: left;
    letter-spacing: 0;
    word-break: normal;
    white-space: nowrap;
  }
  .basic-info {
    margin: 10px 0;
    font-size: 14px;
    color: #7f7f7f;
  }
  .add-process {
    display: flex;
    justify-content: center;
    width: 100%;
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
  z-index: 999;
  display: flex;
  justify-content: flex-end;
  width: 100%;
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
