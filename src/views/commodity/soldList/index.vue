<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      :tool-button="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="Download" plain @click="batchDelete(scope.selectedListIds)">导出</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <!-- createTime -->
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import UserDrawer from "@/views/commodity/unsoldList/modules/UserDrawer.vue";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import {
  getUserList,
  deleteUser,
  editUser,
  addUser,
  changeUserStatus,
  resetUserPassWord,
  exportUserInfo,
  BatchAddUser,
  getUserStatus,
  getUserGender
} from "@/api/modules/user";

const router = useRouter();

// 跳转详情页
const toDetail = () => {
  router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`);
};

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "email", label: "订单编号", width: 160, search: { el: "input" } },
  { prop: "email", label: "游戏分类", isShow: false, width: 160, search: { el: "input" } },
  { prop: "email", label: "标题", isShow: false, width: 160, search: { el: "input" } },
  { prop: "email", label: "出售金额", isShow: false, width: 160, search: { el: "input" } },
  {
    prop: "commodityClass",
    label: "商品分类",
    isShow: false,
    width: 160,
    enum: [
      { label: "已出售", value: 0 },
      { label: "未出售", value: 1 }
    ],
    search: { el: "select" }
  },
  {
    prop: "status",
    label: "商品状态",
    isShow: false,
    width: 160,
    enum: [
      { label: "已出售", value: 0 },
      { label: "未出售", value: 1 }
    ],
    search: { el: "select" }
  },
  {
    prop: "system",
    label: "系统",
    isShow: false,
    width: 160,
    enum: [
      { label: "苹果", value: 0 },
      { label: "安卓", value: 1 }
    ],
    search: { el: "select" }
  },
  { prop: "address", label: "实际回收金额", width: 160 },
  { prop: "address", label: "差值", width: 160 },
  { prop: "address", label: "回收人姓名", width: 160 },
  { prop: "address", label: "发布人姓名", width: 160 },
  { prop: "address", label: "出售人姓名", width: 160 },
  { prop: "address", label: "回收时间", width: 160 },
  { prop: "address", label: "出售时间", width: 160 },
  { prop: "address", label: "滞留时间", width: 160 },
  { prop: "address", label: "账户状态", width: 160 },
  {
    prop: "address",
    label: "有无二次",
    width: 160,
    isShow: false,
    enum: [
      { label: "有", value: 0 },
      { label: "无", value: 1 }
    ],
    search: { el: "select" }
  },
  {
    prop: "address",
    label: "资料是否存档",
    width: 160,
    isShow: false,
    enum: [
      { label: "有", value: 0 },
      { label: "无", value: 1 }
    ],
    search: { el: "select" }
  },
  { prop: "address", label: "账号描述", width: 160 },
  { prop: "address", label: "账户状态", width: 160 },
  { prop: "operation", label: "操作", fixed: "right", width: 200 }
];

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "导出用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
  await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
  proTable.value?.getTableList();
};

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
  await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.username}】用户状态`);
  proTable.value?.getTableList();
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
  );
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: `${title}模板`,
    status: title === "下载",
    tempApi: exportUserInfo,
    updateApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>