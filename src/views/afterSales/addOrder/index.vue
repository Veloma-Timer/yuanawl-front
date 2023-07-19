<template>
  <div class="table-box card">
    <div class="content-box">
      <div class="back-btn">
        <el-button type="primary" @click="goBack" style="width: 112px"> 返回</el-button>
      </div>
      <el-form
        :class="{ 'rule-form': true }"
        ref="ruleFormRef"
        label-width="120px"
        label-suffix=" :"
        :rules="rules"
        :model="ruleForm.row"
        :disabled="ruleForm.isView"
        :hide-required-asterisk="ruleForm.isView"
      >
        <div class="first-header">
          <Header title="基本信息" class="header basic"></Header>
          <el-form label-width="0" class="edit-btn">
            <el-form-item>
              <el-button v-if="!ruleForm.isView && id" type="primary" @click="edit" :disabled="false" style="width: 112px">
                编辑
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-row class="row-line" :gutter="10">
          <el-col :span="6">
            <el-form-item label="账号编号" prop="basicOrderCode">
              <el-input
                v-model="ruleForm.row!.basicOrderCode"
                placeholder="请选择"
                class="order-input"
                :disabled="ruleForm.basicEdit"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="游戏账号" prop="basicAccountId">
              <el-select
                :disabled="ruleForm.basicEdit"
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
              <el-select
                v-model="ruleForm.row!.basicQuestionType"
                placeholder="请选择"
                filterable
                class="order-input"
                :disabled="ruleForm.basicEdit"
              >
                <el-option v-for="item in problemTypeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否在保" prop="basicInsure">
              <el-select
                v-model="ruleForm.row!.basicInsure"
                placeholder="请选择"
                filterable
                class="order-input"
                :disabled="ruleForm.basicEdit"
              >
                <el-option v-for="item in insureList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处理时效" prop="basicHandleTime">
              <el-input-number
                :disabled="ruleForm.basicEdit"
                v-model="ruleForm.row!.basicHandleTime"
                :min="1"
                :max="5"
                placeholder="请输入"
                class="order-input"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 不是管理员不可编辑工单星级 -->
            <el-form-item label="工单星级" prop="basicOrderStar">
              <el-input-number
                :disabled="!isAdmin"
                v-model="ruleForm.row!.basicOrderStar"
                :min="1"
                placeholder="请输入"
                class="order-input"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="sub-title">账号信息:</div>
        <!-- isSales == 1 展示销售 其他展示回收 -->
        <el-row class="basic-info" v-if="baseObj?.isSales == 1">
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
              <span>{{ baseObj?.addPriceRate ? Number(baseObj?.addPriceRate).toFixed(2) : "-" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品周转周期">
              <span>{{ baseObj?.conversionCycle ? Number(baseObj?.conversionCycle).toFixed(2) + "天" : "-" }}</span>
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
        <el-row class="basic-info" v-else>
          <el-col :span="6">
            <el-form-item label="回收人姓名">
              <span>{{ baseObj?.accountRecycler?.userName || "-" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="回收时间">
              <span>{{
                baseObj?.accountRecyclerTime ? dayjs(baseObj.accountRecyclerTime).format("YYYY-MM-DD HH:mm:ss") : "-"
              }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="回收店铺">
              <span>{{ baseObj?.accountRecycler?.userBranch?.branchName || "-" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="回收组">
              <span>{{ baseObj?.accountRecycler?.set?.label || "-" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="回收订单号">
              <span>{{ baseObj?.recycleOrder || "-" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="回收价格">
              <span>{{ baseObj?.accountRecyclerPrice ? Number(baseObj?.accountRecyclerPrice).toFixed(2) : "-" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="回收备注">
              <span>{{ baseObj?.recycleRemark || "-" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="basic-info">
          <el-col :span="24">
            <el-form-item label="备注" prop="basicMessage" label-width="120px">
              <el-input
                :disabled="ruleForm.basicEdit"
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
              <UploadFiles
                v-model:file-list="ruleForm.row!.baiscAnnex"
                height="140px"
                width="140px"
                :disabled="ruleForm.basicEdit"
              ></UploadFiles>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- (setId === 2 || isAdmin) 普通用户 售后才显示 -->
        <div class="add-process" v-if="!isShowAddProcess && (setId === 2 || isAdmin)">
          <el-button type="primary" @click="addProcess" class="btn">添加处理</el-button>
        </div>
        <template v-if="isShowAddProcess">
          <div class="first-header">
            <Header title="工单处理详情" class="header"></Header>
          </div>
          <template v-if="showDeptObj.afterSales">
            <div class="sub-title">售后部门:</div>
            <el-row :gutter="10" style="margin-top: 24px">
              <el-col :span="6">
                <el-form-item label="处理客服" prop="afterCustomerServiceId" label-width="120px">
                  <el-select
                    v-model="ruleForm!.row!.afterCustomerServiceId"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    disabled
                  >
                    <template v-for="item2 in userList" :key="item2.id">
                      <el-option :label="item2.userName" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理时间" prop="afterHandleTime" label-width="120px">
                  <el-date-picker
                    disabled
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
                  <el-select
                    v-model="ruleForm.row!.afterHandleResult"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    :disabled="ruleForm.idEdit2"
                  >
                    <template v-for="item2 in handleTypeList" :key="item2.id">
                      <el-option :label="item2.label" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知其他部门" prop="afterSalesInformDeptId" label-width="120px">
                  <el-select
                    v-model="ruleForm.row!.afterSalesInformDeptId"
                    placeholder="请选择"
                    class="order-input"
                    filterable
                    :disabled="ruleForm.idEdit2"
                  >
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
                    :disabled="ruleForm.idEdit2"
                    v-model="ruleForm.row!.afterCompensationAmount"
                    placeholder="请输入"
                    class="order-input"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="新密保手机" prop="afterNewSecurityPhone" label-width="120px">
                  <el-input
                    v-model="ruleForm.row!.afterNewSecurityPhone"
                    placeholder="请输入"
                    class="order-input"
                    :disabled="ruleForm.idEdit2"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="新密码" prop="afterNewSecurityPassword" label-width="120px">
                  <el-input
                    v-model="ruleForm.row!.afterNewSecurityPassword"
                    placeholder="请输入"
                    class="order-input"
                    :disabled="ruleForm.idEdit2"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="basic-info">
              <el-col :span="24" v-if="ruleForm.row!.afterHandleResult === 7">
                <el-form-item label="处理结果备注" prop="afterSpecHandleResult" label-width="120px">
                  <el-input
                    :disabled="ruleForm.idEdit2"
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
                    :disabled="ruleForm.idEdit2"
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
                    <UploadFiles
                      v-model:file-list="ruleForm.row!.afterAnnex"
                      height="140px"
                      width="140px"
                      :disabled="ruleForm.idEdit2"
                    ></UploadFiles>
                    <div class="tip">可添加图片、视频、音频</div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="showDeptObj.publish">
            <div class="sub-title">发布部门:</div>
            <el-row :gutter="10" style="margin-top: 24px">
              <el-col :span="6">
                <el-form-item label="处理客服" prop="publishHandleCustomerServiceId" label-width="120px">
                  <el-select
                    disabled
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
                    disabled
                    v-model="ruleForm.row!.publishHandleTime"
                    type="date"
                    placeholder="请选择"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理结果" prop="publishHandleResult" label-width="120px">
                  <el-select
                    v-model="ruleForm.row!.publishHandleResult"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    :disabled="ruleForm.idEdit3"
                  >
                    <template v-for="item2 in handleTypeList" :key="item2.id">
                      <el-option :label="item2.label" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知其他部门" prop="publishInformDeptId" label-width="120px">
                  <el-select
                    v-model="ruleForm.row!.publishInformDeptId"
                    placeholder="请选择"
                    class="order-input"
                    filterable
                    :disabled="ruleForm.idEdit3"
                  >
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
                    :disabled="ruleForm.idEdit3"
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
                    :disabled="ruleForm.idEdit3"
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
                    <UploadFiles
                      v-model:file-list="ruleForm.row!.publishAnnex"
                      height="140px"
                      width="140px"
                      :disabled="ruleForm.idEdit3"
                    ></UploadFiles>
                    <div class="tip">可添加图片、视频、音频</div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="showDeptObj.sales">
            <div class="sub-title">销售部门:</div>
            <el-row :gutter="10" style="margin-top: 24px">
              <el-col :span="6">
                <el-form-item label="处理客服" prop="saleHandleCustomerService" label-width="120px">
                  <el-select
                    v-model="ruleForm.row!.saleHandleCustomerService"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    disabled
                  >
                    <template v-for="item2 in userList" :key="item2.id">
                      <el-option :label="item2.userName" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理时间" prop="saleHandleTime" label-width="120px">
                  <el-date-picker
                    v-model="ruleForm.row!.saleHandleTime"
                    type="date"
                    placeholder="请选择"
                    style="width: 100%"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="处理结果" prop="saleHandleResult" label-width="120px">
                  <el-select
                    v-model="ruleForm.row!.saleHandleResult"
                    placeholder="请选择"
                    class="small-input"
                    filterable
                    :disabled="ruleForm.idEdit0"
                  >
                    <template v-for="item2 in handleTypeList" :key="item2.id">
                      <el-option :label="item2.label" :value="item2.id" />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通知其他部门" prop="salesInformDeptId" label-width="120px">
                  <el-select
                    v-model="ruleForm.row!.salesInformDeptId"
                    placeholder="请选择"
                    class="order-input"
                    filterable
                    :disabled="ruleForm.idEdit0"
                  >
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
                    :disabled="ruleForm.idEdit0"
                    v-model="ruleForm.row!.saleCompensationUserAmount"
                    placeholder="请输入"
                    class="order-input"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="给用户换号" prop="saleChangeUserNumber" label-width="120px">
                  <el-select
                    :disabled="ruleForm.idEdit0"
                    v-model="ruleForm.row!.saleChangeUserNumber"
                    placeholder="请选择"
                    class="order-input"
                    filterable
                  >
                    <!-- @change="onChangeAccount" -->
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
                    :disabled="ruleForm.idEdit0"
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
                    :disabled="ruleForm.idEdit0"
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
                    <UploadFiles
                      v-model:file-list="ruleForm.row!.saleannex"
                      height="140px"
                      width="140px"
                      :disabled="ruleForm.idEdit0"
                    ></UploadFiles>
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
  getSetTypes,
  addAfterInfo,
  addSalesInfo,
  addPublishInfo,
  editfterInfo,
  editSalesInfo,
  editPublishInfo,
  getProcessingDept
} from "@/api/modules/order";
import { getAllBranch, getAllBaseAccount, getAllUser } from "@/api/modules/set";
import { findFileType } from "@/utils";
import { useRouter, useRoute } from "vue-router";
import { sellKeyMap } from "@/api/modules/dictionary";
import dayjs from "dayjs";
// import { useAuthButtons } from "@/hooks/useAuthButtons";

// const { BUTTONS } = useAuthButtons();
const route = useRoute();
const id = route.query?.id;
const isView = route.query?.isView ? true : false;
const baseApi = id ? editSalesList : addSalesList;
const afterApi = id ? editfterInfo : addAfterInfo;
const salesApi = id ? editSalesInfo : addSalesInfo;
const publishApi = id ? editPublishInfo : addPublishInfo;
const router = useRouter();

// [
//   { label: "销售组", value: 0 },
//   { label: "售后组", value: 2 },
//   { label: "发布组", value: 3 }
// ]
// 普通账号
const setId = computed(() => {
  const geekerUser: any = window.sessionStorage.getItem("geeker-user") || "{}";
  const id = JSON.parse(geekerUser)?.userInfo?.setId;
  return id;
});

// 管理员
const isAdmin = computed(() => {
  const geekerUser: any = window.sessionStorage.getItem("geeker-user") || "{}";
  const id = JSON.parse(geekerUser)?.userInfo?.isAdmin === "1";
  return id;
});

const basicRule = !id
  ? {
      basicOrderCode: [{ required: true, message: "必填项不能为空" }],
      basicOrderStar: [{ required: true, message: "必填项不能为空" }],
      basicAccountId: [{ required: true, message: "必填项不能为空" }],
      basicQuestionType: [{ required: true, message: "必填项不能为空" }],
      basicInsure: [{ required: true, message: "必填项不能为空" }],
      basicHandleTime: [{ required: true, message: "必填项不能为空" }],
      basicMessage: [{ required: true, message: "必填项不能为空" }],
      baiscAnnex: [{ required: true, message: "必填项不能为空" }]
    }
  : {};

const afterRule =
  setId.value === 2 || isAdmin.value
    ? {
        afterSpecHandleResult: [{ required: true, message: "必填项不能为空" }],
        afterSalesRemark: [{ required: true, message: "必填项不能为空" }],
        afterCustomerServiceId: [{ required: true, message: "必填项不能为空" }],
        afterHandleTime: [{ required: true, message: "必填项不能为空" }],
        afterHandleResult: [{ required: true, message: "必填项不能为空" }],
        afterAnnex: [{ required: true, message: "必填项不能为空" }]
      }
    : {};

const publishRule =
  setId.value === 3 || isAdmin.value
    ? {
        publishHandleCustomerServiceId: [{ required: true, message: "必填项不能为空" }],
        publishHandleTime: [{ required: true, message: "必填项不能为空" }],
        publishHandleResult: [{ required: true, message: "必填项不能为空" }],
        publishAnnex: [{ required: true, message: "必填项不能为空" }],
        publishResultRemark: [{ required: true, message: "必填项不能为空" }],
        publishRemark: [{ required: true, message: "必填项不能为空" }]
      }
    : {};

const saleRule =
  setId.value === 0 || isAdmin.value
    ? {
        saleHandleCustomerService: [{ required: true, message: "必填项不能为空" }],
        saleHandleTime: [{ required: true, message: "必填项不能为空" }],
        saleHandleResult: [{ required: true, message: "必填项不能为空" }],
        sallerName: [{ required: true, message: "必填项不能为空" }],
        sallerTime: [{ required: true, message: "必填项不能为空" }],
        sallerChannel: [{ required: true, message: "必填项不能为空" }],
        saleannex: [{ required: true, message: "必填项不能为空" }],
        salesResultRemark: [{ required: true, message: "必填项不能为空" }],
        salesRemark: [{ required: true, message: "必填项不能为空" }]
      }
    : {};

const rules = reactive({
  ...basicRule,
  ...afterRule,
  ...publishRule,
  ...saleRule
});

interface IAddOrder {
  isView: boolean; // 点击查看工单进来的, 没有编辑按钮
  basicEdit: boolean; // 基本信息只有新增能改
  idEdit0: boolean; // 销售组
  idEdit2: boolean; // 售后组
  idEdit3: boolean; // 发布组
  row: Partial<SalesOrder.AddWorkOrder>;
}

// 当前用户的id
const geekerUser: any = window.sessionStorage.getItem("geeker-user") || "{}";
const userId = JSON.parse(geekerUser)?.userInfo?.id;
// 当前时间
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const currentDate = `${year}-${month}-${day}`;
  return currentDate;
}

// 调用函数获取当前时间
const currentDateString = getCurrentDate();
console.log(currentDateString);
const ruleForm = ref<IAddOrder>({
  // 编辑: 默认禁用
  isView: isView,
  basicEdit: id ? true : false,
  idEdit0: id ? true : false,
  idEdit2: id ? true : false,
  idEdit3: id ? true : false,
  row: {
    afterCustomerServiceId: userId,
    afterHandleTime: getCurrentDate(),
    publishHandleCustomerServiceId: userId,
    publishHandleTime: getCurrentDate(),
    saleHandleCustomerService: userId,
    saleHandleTime: getCurrentDate()
  }
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
        afterCustomerServiceId: userId,
        afterHandleTime: getCurrentDate(),
        afterHandleResult: afterInfo?.afterSaleResultId,
        afterSpecHandleResult: afterInfo?.afterSalesResultRemark,
        afterCompensationAmount: afterInfo?.afterSalesCompensationAmount,
        afterNewSecurityPhone: afterInfo?.newSecretCellPhone,
        afterNewSecurityPassword: afterInfo?.newPassword,
        afterSalesRemark: afterInfo?.afterSalesRemark,
        afterSalesInformDeptId: afterInfo?.afterSalesInformDeptId,
        afterAnnex: (afterInfo?.afterSaleAssets || [])?.map((imgItem: any) => {
          return {
            path: imgItem.path,
            url: imgItem.path,
            id: imgItem.id,
            type: findFileType(imgItem.path)
          };
        })
      };
    } else {
      afterObj = {
        afterCustomerServiceId: userId,
        afterHandleTime: getCurrentDate()
      };
    }
    // 发布
    let publishObj = {};
    if (publistInfo) {
      publishObj = {
        publishHandleCustomerServiceId: userId,
        publishHandleTime: getCurrentDate(),
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
    } else {
      publishObj = {
        publishHandleCustomerServiceId: userId,
        publishHandleTime: getCurrentDate()
      };
    }
    // 销售
    let saleObj = {};
    if (saleInfo) {
      saleObj = {
        saleHandleCustomerService: userId,
        saleHandleTime: getCurrentDate(),
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
    } else {
      saleObj = {
        saleHandleCustomerService: userId,
        saleHandleTime: getCurrentDate()
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
  problemTypeList.value = data?.problemTypes || [];
};
getProblemTypesFun();

// 数据字典-处理结果
const handleTypeList: Ref = ref([]);
const getHandleTypesFun = async () => {
  const { data } = await getHandleTypes();
  handleTypeList.value = data?.handleTypes || [];
};
getHandleTypesFun();

// 数据字典-部门列表
const setTypeList: Ref = ref([]);
const getSetTypeFun = async () => {
  const { data } = await getSetTypes();
  setTypeList.value = data?.set || [];
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
      // 只能新增,不能修改 id为空才能调用
      const { data }: any = !id && (await baseApi!(baseData));
      // 以下只能改当前账号的
      // 售后信息
      (setId.value === 2 || isAdmin.value) &&
        (await afterApi({
          ...idObj,
          orderId: data?.id || id,
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
        }));
      // 发布信息
      (setId.value === 3 || isAdmin.value) &&
        (await publishApi({
          ...idObj,
          orderId: data?.id || id, // 工单id
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
        }));
      // 销售信息
      (setId.value === 0 || isAdmin.value) &&
        (await salesApi({
          ...idObj,
          orderId: data?.id || id, // 工单id
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
        }));
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
  if (isAdmin.value) {
    // 管理员能改全部
    ruleForm.value.basicEdit = false;
    ruleForm.value.idEdit0 = false;
    ruleForm.value.idEdit2 = false;
    ruleForm.value.idEdit3 = false;
  } else {
    // 普通用户自能改自己所在组
    if (setId.value === 0) {
      ruleForm.value.idEdit0 = false;
    }
    if (setId.value === 2) {
      ruleForm.value.idEdit2 = false;
    }
    if (setId.value === 3) {
      ruleForm.value.idEdit3 = false;
    }
  }
};

const addProcess = () => {
  isShowAddProcess.value = true;
  if (isAdmin.value) {
    showDeptObj.value = {
      afterSales: true,
      sales: true,
      publish: true
    };
  } else {
    // 新增 按照 当前登录的人判断
    showDeptObj.value = {
      afterSales: setId.value === 2,
      sales: setId.value === 0,
      publish: setId.value === 3
    };
  }
};

type UserObj = { userName: string; id: number };
const userList = ref<UserObj[]>([]);

// 回显用户下拉和订单数据
const initOrderData = async () => {
  // 默认时效5
  ruleForm.value.row.basicHandleTime = 5;
  // 不是管理员不可编辑工单星级 就默认星级4 管理员可以无限加
  if (!isAdmin.value) {
    ruleForm.value.row.basicOrderStar = 4;
  }
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

const isShowAddProcess: Ref = ref(false);

let showDeptObj: Ref = ref({ afterSales: true, sales: true, publish: true });
async function getProcessingDeptFun() {
  if (id) {
    const { afterSales, sales, publish }: any = await getProcessingDept(Number(id));
    showDeptObj.value = { afterSales, sales, publish };
    // 编辑 根据后台接口显示
    if (afterSales || sales || publish) {
      isShowAddProcess.value = true;
    }
  } else {
    if (isAdmin.value) {
      isShowAddProcess.value = false;
    } else {
      // 新增 当前登录的用户不在那三个中 添加处理按钮不显示(普通用户)
      if (!id && [0, 2, 3].includes(setId.value)) {
        isShowAddProcess.value = false;
      }
    }
  }
}
getProcessingDeptFun();
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
