<template>
  <div class="table-box card">
    <div class="content-box">
      <div class="back-btn" v-if="!isAddProcess">
        <el-button type="primary" @click="goBack" style="width: 112px"> 返回 </el-button>
      </div>
      <el-form
        :class="{ 'rule-form': true }"
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
          <el-form label-width="0" class="edit-btn">
            <el-form-item>
              <el-button v-if="id" type="primary" @click="edit" :disabled="false" style="width: 112px"> 编辑 </el-button>
            </el-form-item>
          </el-form>
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
                  <el-option :label="item.accountNumber" :value="item.id">
                    <span style="float: left">{{ item.accountCode }}</span>
                    <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{
                      item.accountNumber
                    }}</span>
                  </el-option>
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
        <div class="sub-title">账号信息:</div>
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
          <div class="first-header" v-if="orderStatus.length > 0">
            <Header title="工单处理详情" class="header"></Header>
          </div>
          <template v-if="orderStatus.includes(1)">
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
              <el-col :span="6">
                <el-form-item label="通知其他部门" prop="afterSalesInformDeptId" label-width="120px">
                  <el-select v-model="ruleForm.row!.afterSalesInformDeptId" placeholder="请选择" class="order-input" filterable>
                    <template v-for="item in setTypeList" :key="item.value">
                      <el-option :label="item.label" :value="item.value" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
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
              <el-col :span="24" v-if="ruleForm.row!.afterHandleResult === 7">
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
          <template v-if="orderStatus.includes(2)">
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
                  <el-date-picker
                    v-model="ruleForm.row!.publishHandleTime"
                    type="date"
                    placeholder="请选择"
                    style="width: 100%"
                  />
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
              <el-col :span="6">
                <el-form-item label="通知其他部门" prop="publishInformDeptId" label-width="120px">
                  <el-select v-model="ruleForm.row!.publishInformDeptId" placeholder="请选择" class="order-input" filterable>
                    <template v-for="item in setTypeList" :key="item.value">
                      <el-option :label="item.label" :value="item.value" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="row-line">
              <el-col :span="24" v-if="ruleForm.row!.publishHandleResult === 7">
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
          <template v-if="orderStatus.includes(3)">
            <div class="sub-title">销售部门:</div>
            <el-row :gutter="10" style="margin-top: 24px">
              <el-col :span="6">
                <el-form-item label="处理客服" prop="saleHandleCustomerService" label-width="120px">
                  <el-select
                    v-model="ruleForm.row!.saleHandleCustomerService"
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
              <el-col :span="6">
                <el-form-item label="通知其他部门" prop="salesInformDeptId" label-width="120px">
                  <el-select v-model="ruleForm.row!.salesInformDeptId" placeholder="请选择" class="order-input" filterable>
                    <template v-for="item in setTypeList" :key="item.value">
                      <el-option :label="item.label" :value="item.value" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
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
                <el-form-item label="给用户换号" prop="saleChangeUserNumber" label-width="120px">
                  <el-select
                    v-model="ruleForm.row!.saleChangeUserNumber"
                    placeholder="请选择"
                    class="order-input"
                    filterable
                    @change="onChangeAccount"
                  >
                    <template v-for="item in accountList" :key="item.id">
                      <el-option :label="item.accountNumber" :value="item.id">
                        <span style="float: left">{{ item.accountCode }}</span>
                        <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{
                          item.accountNumber
                        }}</span>
                      </el-option>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24" v-if="ruleForm.row!.saleHandleResult === 7">
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
    </div>
    <div class="foot-btn">
      <el-button @click="goBack" class="cancel">取消</el-button>
      <el-button type="primary" v-show="!ruleForm.isView" @click="handleSubmit" class="ok">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, computed } from "vue";
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
  getSetTypes,
  addAfterInfo,
  addSalesInfo,
  addPublishInfo,
  editfterInfo,
  editSalesInfo,
  editPublishInfo
} from "@/api/modules/order";
import { getAllBranch, getAllBaseAccount, getAllUser } from "@/api/modules/set";
import { findFileType } from "@/utils";
import { useRouter, useRoute } from "vue-router";
import { sellKeyMap } from "@/api/modules/dictionary";
import dayjs from "dayjs";
// import { useAuthButtons } from "@/hooks/useAuthButtons";

// const { BUTTONS } = useAuthButtons();
const route = useRoute();
const id = route.query.id;
const baseApi = id ? editSalesList : addSalesList;
const afterApi = id ? editfterInfo : addAfterInfo;
const salesApi = id ? editSalesInfo : addSalesInfo;
const publishApi = id ? editPublishInfo : addPublishInfo;
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
  // 编辑: 默认禁用
  isView: id ? true : false,
  row: {}
});

const baseObj = ref();
function onChangeAccount(e: any) {
  const obj = accountList.value.find(item => item.id === e);
  baseObj.value = obj;
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
      basicOrderCode: data?.orderCode,
      basicAccountId: data?.accountId,
      basicQuestionType: data?.problemTypeId,
      basicInsure: data?.insure,
      basicOrderStar: data?.orderStar,
      basicHandleTime: data?.handleTime,
      basicMessage: data?.remark,
      baiscAnnex: (data?.assets || []).map((imgItem: any) => {
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
        afterHandleResult: afterInfo?.afterSaleResultId,
        afterHandleTime: afterInfo?.afterSaleHandleTime,
        afterSpecHandleResult: afterInfo?.afterSalesResultRemark,
        afterCompensationAmount: afterInfo?.afterSalesCompensationAmount,
        afterNewSecurityPhone: afterInfo?.newSecretCellPhone,
        afterNewSecurityPassword: afterInfo?.newPassword,
        afterSalesRemark: afterInfo?.afterSalesRemark,
        afterSalesInformDeptId: afterInfo?.afterSalesInformDeptId,
        afterCustomerServiceId: afterInfo?.afterSaleServiceId,
        afterAnnex: (afterInfo?.afterSaleAssets || [])?.map((imgItem: any) => {
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
        publishHandleCustomerServiceId: publistInfo?.publishServiceId,
        publishHandleTime: publistInfo?.publishHandleTime,
        publishHandleResult: publistInfo?.publishResultId,
        publishResultRemark: publistInfo?.publishResultRemark,
        publishRemark: publistInfo?.publishRemark,
        publishInformDeptId: publistInfo?.publishInformDeptId,
        publishAnnex: (publistInfo?.publishAssets || [])?.map((imgItem: any) => {
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
        saleHandleCustomerService: saleInfo?.salesResultId,
        saleHandleTime: saleInfo?.salesHandleTime,
        saleHandleResult: saleInfo?.salesResultId,
        saleCompensationUserAmount: saleInfo?.salesCompensationAmount,
        saleChangeUserNumber: saleInfo?.newAccountId,
        salesResultRemark: saleInfo?.salesResultRemark,
        salesRemark: saleInfo?.salesRemark,
        salesInformDeptId: afterInfo?.salesInformDeptId,
        saleannex: (saleInfo?.salesAssets || [])?.map((imgItem: any) => {
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
type AccountObj = { accountNumber: string; accountCode: string; id: number };
const accountList = ref<AccountObj[]>([]);
const getAllAccountList = async () => {
  const { data } = await getAllBaseAccount({});
  accountList.value = data;
};
getAllAccountList();

// 数据字典-问题类型
const problemTypeList: Ref = ref([]);
const getProblemTypesFun = async () => {
  const { data } = await getProblemTypes();
  problemTypeList.value = data.problemTypes;
};
getProblemTypesFun();

// 数据字典-处理结果
const handleTypeList: Ref = ref([]);
const getHandleTypesFun = async () => {
  const { data } = await getHandleTypes();
  handleTypeList.value = data.handleTypes;
};
getHandleTypesFun();

// 数据字典-部门列表
const setTypeList: Ref = ref([]);
const getSetTypeFun = async () => {
  const { data } = await getSetTypes();
  setTypeList.value = data.set;
};
getSetTypeFun();

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
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
        salesRemark,
        afterSalesInformDeptId,
        salesInformDeptId,
        publishInformDeptId
      } = ruleForm.value.row;
      // 工单的记录id
      let idObj = {};
      if (id) {
        idObj = { id };
      }
      const baseData = {
        ...idObj,
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
      // 基本信息
      const { data }: any = await baseApi!(baseData);
      // 售后信息
      await afterApi({
        ...idObj,
        orderId: data.id || id,
        afterSaleResultId: afterHandleResult, // 售后处理结果
        afterSalesResultRemark: afterSpecHandleResult, // 售后处理结果备注(这个只有当处理结果类型为其他的时候才有)
        afterSalesCompensationAmount: afterCompensationAmount, // 售后赔付金额
        newSecretCellPhone: afterNewSecurityPhone, // 新密保手机
        newPassword: afterNewSecurityPassword, // 新密码
        afterSalesRemark: afterSalesRemark, // 售后备注
        afterSalesInformDeptId: afterSalesInformDeptId,
        afterSaleAssets: afterAnnex?.map(item => {
          return {
            path: item?.response?.path || item.url || item.path,
            id: item.id || item.uid
          };
        }) // 售后提交资源
      });
      // 发布信息
      await publishApi({
        ...idObj,
        orderId: data.id, // 工单id
        publishResultId: publishHandleResult, // 发布处理结果
        publishResultRemark: publishResultRemark, // 销售处理结果备注
        publishRemark: publishRemark, // 发布备注
        publishInformDeptId: publishInformDeptId,
        publishAssets: publishAnnex?.map(item => {
          return {
            path: item?.response?.path || item.url || item.path,
            id: item.id || item.uid
          };
        }) // 发布提交资源
      });
      // 销售信息
      await salesApi({
        ...idObj,
        orderId: data.id, // 工单id
        salesResultId: saleHandleResult, // 销售处理结果
        salesCompensationAmount: saleCompensationUserAmount, // 赔付用户金额
        newAccountId: saleChangeUserNumber, // 给用户换号: 新账号id
        salesResultRemark: salesResultRemark, // 销售处理结果备注
        salesRemark: salesRemark, // 销售备注
        salesInformDeptId: salesInformDeptId,
        salesAssets: saleannex?.map(item => {
          return {
            path: item?.response?.path || item.url || item.path,
            id: item.id || item.uid
          };
        }) // 销售提交资源
      });
      ElMessage.success({ message: `操作成功！` });
      goBack();
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

const orderStatus = computed(() => {
  // 显示条件                             售后部门 => 1    发布部门 => 2 销售部门 =>3
  // isSales(账号销售状态)                未售     => 0    已售出   => 1
  // haveExpired(账号是否过了工单处理时效) 没过期   => 0    过期     => 1
  // handleTypes(售后处理类型)            换号     => 1    给客户赔钱 => 2 已重新发布 => 3 未重新发布 => 4 追回 => 5 卖家赔钱 => 6 其他 => 7  未追回 => 8

  // if (账号未售 && 售后处理类型是卖家赔钱) {
  //   // 只显示售后
  // } else if (账号未售) {
  //   // 显示售后 和 发布
  // }
  // if (账号已售 && 售后处理类型是成功追回) {
  //   // 显示售后和销售
  // }
  // if (账号已售 && 当前时间过了工单的处理时效) {
  //   // 显示售后和销售
  // }
  // if (账号已售 && 售后处理类型是没有追回) {
  //   // 显示售后、销售、发布
  // }
  let isSales = baseObj?.value?.isSales;
  let handleType = ruleForm?.value?.row?.afterHandleResult;
  let haveExpired = 1;
  if (isSales === 0 && handleType === 6) {
    return [1];
  } else if (isSales === 0) {
    return [1, 2];
  }
  if (isSales === 1 && handleType === 5) {
    return [2, 3];
  }
  if (isSales === 1 && haveExpired === 1) {
    return [1, 3];
  }
  if (isSales === 1 && handleType === 8) {
    return [1, 2, 3];
  }
  return [1, 2, 3];
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
.rule-form-full {
  height: 100%;
}
.rule-form {
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
.first-header {
  position: relative;
  display: flex;
  margin-bottom: 20px;
  .basic {
    :deep(.title) {
      padding: 10px 31px;
      overflow: hidden;
    }
  }
  .edit-btn {
    position: absolute;
    right: 0;
  }
}
.back-btn {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}
.content-box {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  .hide-scroll::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
.card {
  padding-bottom: 0;
  padding-right: 0;
}
.rule-form {
  width: 100%;
  padding-right: 20px;
}
.foot-btn {
  z-index: 999;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  border-top: 1px solid #ebebeb;
  padding: 10px 20px 10px 0;
  overflow: hidden;
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
