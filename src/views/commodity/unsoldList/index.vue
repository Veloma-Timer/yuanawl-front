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
      <template #tableHeader="scope">
        <el-button type="primary" v-if="BUTTONS.export" :icon="Document" plain @click="batchDelete(scope.selectedListIds)"
          >导出Excel</el-button
        >
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <!-- createTime -->
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <!--        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>-->
      </template>
    </ProTable>
    <SalesDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
// import UnsoldDrawer from "@/views/commodity/unsoldList/modules/UnsoldDrawer.vue";
import SalesDrawer from "./modules/SalesDrawer.vue";
import UnsoldDrawer from "@/views/commodity/unsoldList/modules/UnsoldDrawer.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Document, View } from "@element-plus/icons-vue";
import { deleteUser } from "@/api/modules/user";
import { addSummary, editSummary, summaryList } from "@/api/modules/commodity";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getAllList } from "@/api/modules/accountClass";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { getAllBaseAccount, getAllBranch } from "@/api/modules/set";
import { shortcuts } from "@/utils";
import deepcopy from "deepcopy";

const { BUTTONS } = useAuthButtons();

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ isSales: "0" });

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
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return summaryList(newParams);
};
const getFixed = (str: string) => {
  if (!str) return "--";
  return "￥" + parseFloat(str).toFixed(2);
};
// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Commodity.Account>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "accountCode",
    label: "账号编码",
    width: 160,
    enum: getAllBaseAccount,
    fieldNames: { label: "accountCode", value: "accountCode", name: "accountNumber" },
    render: ({ row }) => {
      const status = row.isWorkOrder === "1";
      return (
        <div class="cursor-pointer">
          {status ? (
            <router-link to={{ name: "工单新增", query: { id: row?.orderId || "" } }}>
              <span class="red">{row.accountCode}</span>
            </router-link>
          ) : (
            <span>{row.accountCode}</span>
          )}
        </div>
      );
    },
    search: {
      el: "select-v2",
      props: {
        filterable: true
      },
      slotName: true
    }
  },
  {
    prop: "qq",
    label: "QQ号",
    sortable: true,
    width: 160,
    search: {
      el: "input"
    }
  },
  {
    prop: "accountStatus",
    label: "账户状态",
    width: 160,
    enum: [
      { label: "已售", value: 1 },
      { label: "未售", value: 0 }
    ],
    search: { el: "select" },
    render: ({ row }) => {
      const status = row.accountStatus === 0;
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "未售" : "已售"}</span>
        </div>
      );
    }
  },
  // {
  //   prop: "accountNumber",
  //   label: "游戏编号",
  //   width: 160,
  //   enum: getAllBaseAccount,
  //   search: {
  //     el: "select",
  //     slotName: true
  //   },
  //   fieldNames: { label: "accountNumber", value: "id", name: "accountCode" },
  //   render: scope => {
  //     return <span>{scope.row?.accountNumber}</span>;
  //   }
  // },
  {
    prop: "accountType",
    label: "游戏分类",
    width: 160,
    enum: getAllList,
    search: { el: "select" },
    fieldNames: { label: "typeName", value: "id" },
    render: ({ row }) => row.accountTypeNames
  },
  {
    prop: "salePrice",
    label: "出售金额",
    width: 160,
    render: scope => {
      return getFixed(scope.row!.salePrice);
    }
  },
  {
    prop: "accountRecyclerPrice",
    label: "实际回收金额",
    width: 160,
    render: scope => {
      return getFixed(scope.row!.accountRecyclerPrice);
    }
  },
  {
    prop: "branchId",
    label: "所属问店",
    width: 160,
    enum: getAllBranch,
    search: { el: "select" },
    fieldNames: { label: "branchName", value: "id" },
    render: scope => {
      return scope.row.branch.branchName;
    }
  },
  // { prop: "accountNumber", label: "账号", width: 160 },
  { prop: "accountPassword", label: "密码", width: 160 },
  { prop: "accountTel", label: "手机号", width: 160 },
  { prop: "accountRemark", label: "备注", width: 160 },
  {
    prop: "noSaleResidenceTime",
    label: "滞留时间",
    width: 160,
    render: ({ row }) => {
      return (row?.noSaleResidenceTime || 0) + "天";
    }
  },
  {
    prop: "haveSecondary",
    label: "有无二次",
    width: 160,
    enum: [
      { label: "有", value: "1" },
      { label: "无", value: "0" }
    ],
    search: { el: "select" }
  },
  {
    prop: "isSave",
    label: "资料是否存档",
    width: 160,
    enum: [
      { label: "有", value: "0" },
      { label: "无", value: "1" }
    ],
    search: { el: "select" }
  },
  { prop: "accountDesc", label: "账号描述", width: 160 },
  {
    prop: "timeSection",
    isShow: false,
    label: "时间区间",
    search: {
      el: "date-picker",
      props: { type: "daterange", unlinkPanels: true, shortcuts: shortcuts, valueFormat: "YYYY-MM-DD" }
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 150 }
];

// 删除用户信息
const deleteAccount = async (params: Commodity.Account) => {
  await useHandleData(editSummary, { id: [params.id] }, `删除【${params.accountCode}】用户`);

  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "导出用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 重置用户密码
// 切换用户状态
// 导出用户列表
// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UnsoldDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Commodity.Account> = {}) => {
  let accountType: [] | undefined = [];
  if (title === "编辑") {
    accountType = row.accountType.map(item => {
      return parseFloat(item);
    });
  }
  const params = {
    title,
    isView: title === "编辑",
    row: { ...row, accountType: accountType },
    api: title === "新增" ? addSummary : title === "编辑" ? editSummary : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
<style lang="scss">
.circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}
.red {
  color: var(--el-color-error);
}
.v-red {
  @extend .circle;
  background-color: var(--el-color-error);
}
.v-green {
  @extend .circle;
  background-color: var(--el-color-success);
}
</style>
