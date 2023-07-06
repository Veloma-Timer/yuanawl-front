<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button v-if="BUTTONS.add" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增回收列表</el-button>
        <el-button type="primary" :icon="Download" plain @click="batchAdd('下载')">下载账号模板</el-button>
        <el-button v-if="BUTTONS.import" type="primary" :icon="Download" plain @click="batchAdd('导入')">导入模板</el-button>
        <el-button v-if="BUTTONS.export" type="primary" :icon="Upload" plain @click="onExport">导出</el-button>
      </template>
      <template #accountRecyclerPrice="scope">
        {{ getFixed(scope.row.accountRecyclerPrice) || "--" }}
      </template>
      <!-- usernameHeader -->
      <!-- createTime -->
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" v-if="BUTTONS.view" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="Delete" v-if="BUTTONS.del" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <recoverDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import recoverDrawer from "@/views/commodity/recovery/modules/recoverDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, Download, Upload, View } from "@element-plus/icons-vue";
import {
  addRecycle,
  deleteSummary,
  editRecycle,
  getRecycleList,
  summaryExport,
  summaryTemplate,
  summaryUpload
} from "@/api/modules/commodity";
import { getAllList } from "@/api/modules/accountClass";
import { Commodity } from "@/api/interface/commodity/commodity";
import { saveFile } from "@/utils/file";
import { getAllBaseAccount, getAllBranch } from "@/api/modules/set";
import { getUserAll } from "@/api/modules/user";
import { parseTime } from "@/utils/is";
import { useUserStore } from "@/stores/modules/user";
import { decryption } from "@/utils/AESUtil";
// import { useRoute } from "vue-router";
const userStore = useUserStore();
const token = userStore.token; // 获取token
const obj = JSON.parse(decryption("token", token));
// const route = useRoute();
// 跳转详情页
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();
// 账号列表
type AccountObj = { accountNumber: string; accountCode: string; id: number };
const accountList = reactive<AccountObj[]>([]);
const getAllAccountList = async () => {
  const { data } = await getAllBaseAccount({});
  accountList.value = data;
};
getAllAccountList();
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
const { BUTTONS } = useAuthButtons();
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: Number(data.pageNum),
    pageSize: Number(data.pageSize)
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getRecycleList(newParams);
};
const getFixed = (str: string) => {
  if (str) {
    return "￥" + parseFloat(str).toFixed(2);
  }
  return "--";
};
// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Commodity.Recovery>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "branchId",
    label: "所属门店",
    width: 160,
    enum: getAllBranch,
    search: { el: "select" },
    fieldNames: { label: "branchName", value: "id" }
  },
  {
    prop: "accountNumber",
    label: "游戏编号",
    width: 160,
    enum: getAllBaseAccount,
    search: {
      el: "select",
      slotName: true
    },
    fieldNames: { label: "accountNumber", value: "id", name: "accountCode" },
    render: scope => {
      return <span>{scope.row?.accountNumber}</span>;
    }
  },
  {
    prop: "accountType",
    label: "游戏分类",
    width: 160,
    enum: getAllList,
    search: { el: "select" },
    fieldNames: { label: "typeName", value: "id" }
  },
  { prop: "accountTitle", label: "账户标题", width: 160, search: { el: "input" } },
  {
    prop: "accountNumber",
    label: "账号",
    width: 160,
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row?.accountNumber}</span>;
    }
  },
  { prop: "accountPassword", label: "密码", width: 160 },
  { prop: "accountTel", label: "密保手机", width: 160, search: { el: "input" } },
  { prop: "phoneRemark", label: "手机卡备注", width: 160, search: { el: "input" } },
  { prop: "email", label: "邮箱", width: 160, search: { el: "input" } },
  { prop: "emailSecret", label: "邮箱密保", width: 160, search: { el: "input" } },
  {
    prop: "systemId",
    label: "系统",
    width: 160,
    search: { el: "select" },
    enum: [
      { label: "安卓QQ", value: 1 },
      { label: "苹果QQ", value: 2 },
      { label: "安卓微信", value: 3 },
      { label: "苹果微信", value: 4 }
    ]
  },
  { prop: "accountRemark", label: "账号描述", width: 160, search: { el: "input" } },
  { prop: "campId", label: "营地号", width: 160, search: { el: "input" } },
  {
    prop: "haveSecondary",
    label: "实名情况",
    width: 160,
    search: { el: "select" },
    enum: [
      { label: "有", value: "1" },
      { label: "无", value: "0" }
    ]
  },
  {
    prop: "accountRecyclerPrice",
    label: "回收价",
    width: 160,
    search: { el: "input" }
  },
  { prop: "recycleOrder", label: "回收订单号", width: 160, search: { el: "input" } },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    width: 160,
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  { prop: "accountRecyclerTime", label: "回收日期", width: 160 },
  { prop: "recycleRemark", label: "回收备注", width: 160 },
  { prop: "operation", label: "操作", fixed: "right", width: 200 }
];

// 删除用户信息
const deleteAccount = async (params: Commodity.Account) => {
  await useHandleData(deleteSummary, { id: [params.id] }, `删除编号为【${params.accountCode}】的账户`);
  proTable.value?.getTableList();
};
// 批量删除用户信息
// const batchDelete = async (id: string[]) => {
//   await useHandleData(deleteSummary, { id }, "导出用户信息");
//   proTable.value?.clearSelection();
//   proTable.value?.getTableList();
// };

const onExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await summaryExport(obj);
  saveFile(data, "账号汇总导出");
};

// 重置用户密码
// 切换用户状态
// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: `${title}账号`,
    status: title === "下载",
    tempApi: summaryTemplate,
    updateApi: summaryUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof recoverDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Commodity.Recovery> = {}) => {
  // 当前时间
  const date = new Date();
  const time = parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}");
  const params = {
    title,
    isView: title === "查看",
    status: title === "查看",
    row: { ...row, accountRecyclerTime: time, accountRecyclerId: obj.user.id },
    api: title === "新增" ? addRecycle : title === "查看" ? editRecycle : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
