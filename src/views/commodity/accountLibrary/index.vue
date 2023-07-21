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
        <el-button v-if="BUTTONS.add" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增账号</el-button>
        <el-button type="primary" :icon="Download" plain @click="batchAdd('下载')">下载账号模板</el-button>
        <el-button v-if="BUTTONS.import" type="primary" :icon="Download" plain @click="batchAdd('导入')">导入模板</el-button>
        <el-button v-if="BUTTONS.export" type="primary" :icon="Upload" plain @click="onExport">导出</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <template #accountNumber="scope">
        {{ scope.row.accountNumber }}
      </template>
      <template #accountTel="{ row }">
        <div class="flx-justify-between">
          <span>{{ row.status ? getPhone(row.accountTel) : setPhone(row.accountTel) }}</span>
          <span class="cursor-pointer" @click="onSetPhone(row)">
            <el-icon v-show="row.status"><View /></el-icon>
            <el-icon v-show="!row.status"><Hide /></el-icon>
          </span>
        </div>
      </template>
      <!-- usernameHeader -->
      <!-- createTime -->
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" v-if="BUTTONS.view" @click="openDrawer('查看', scope.row)">查看</el-button>
        <!--        <el-button type="primary" link :icon="Delete" v-if="BUTTONS.del" @click="deleteAccount(scope.row)">删除</el-button>-->
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import UserDrawer from "@/views/commodity/summary/modules/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Download, Hide, Upload, View } from "@element-plus/icons-vue";
import { getUserAll } from "@/api/modules/user";
import {
  addSummary,
  deleteSummary,
  editSummary,
  pointBury,
  summaryExport,
  summaryList,
  summaryTemplate,
  summaryUpload
} from "@/api/modules/commodity";
import { getAllList } from "@/api/modules/accountClass";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getPhone, parseTime, setPhone } from "@/utils";
import { saveFile } from "@/utils/file";
import { getAllBaseAccount, getAllBranch } from "@/api/modules/set";
import { useRoute } from "vue-router";
import { getSetTypes } from "@/api/modules/order";

const route = useRoute();
// 跳转详情页
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

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
  return summaryList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Commodity.Account>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "accountCode",
    label: "账号编号",
    sortable: true,
    width: 160,
    enum: getAllBaseAccount,
    search: {
      el: "select",
      slotName: true
    },
    fieldNames: { label: "accountCode", value: "id", name: "accountNumber" },
    render: scope => {
      return <span>{scope.row?.accountCode}</span>;
    }
  },
  {
    prop: "accountStatus",
    label: "账户状态",
    width: 160,
    sortable: true,
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
  {
    prop: "isWorkOrder",
    label: "是否有工单",
    width: 160,
    sortable: true,
    enum: [
      { label: "有", value: "1" },
      { label: "没有", value: "0" }
    ],
    search: { el: "select" },
    render: ({ row }) => {
      const status = row.isWorkOrder === "0";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "没有" : "有"}</span>
        </div>
      );
    }
  },
  {
    prop: "isSales",
    label: "账户发布状态",
    search: { el: "select" },
    sortable: true,
    width: 160,
    enum: [
      { label: "未发布", value: "0" },
      { label: "已发布", value: "1" }
    ],
    render: ({ row }) => {
      const status = row.isSales === "0";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "未发布" : "已发布"}</span>
        </div>
      );
    }
  },
  //  {
  //    prop: "accountNumber",
  //    sortable: true,
  //    label: "游戏编号",
  //    width: 160,
  //    enum: getAllBaseAccount,
  //    search: {
  //      el: "select",
  //      slotName: true
  //    },
  //    fieldNames: { label: "accountNumber", value: "id", name: "accountCode" },
  //    render: scope => {
  //      return <span>{scope.row?.accountNumber}</span>;
  //    }
  //  },
  {
    prop: "salesSetId",
    sortable: true,
    label: "所在租",
    width: 160,
    enum: async () => {
      const {
        data: { set = [] }
      } = await getSetTypes();
      return { data: set };
    },
    search: {
      el: "select"
    },
    fieldNames: { label: "label", value: "value" }
  },
  {
    prop: "accountType",
    label: "游戏分类",
    sortable: true,
    width: 160,
    enum: getAllList,
    search: { el: "select" },
    fieldNames: { label: "typeName", value: "id" }
  },
  {
    prop: "salePeopleId",
    label: "出售人姓名",
    sortable: true,
    width: 160,
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "saleTime",
    sortable: true,
    label: "出售时间",
    width: 160,
    render: scope => {
      return parseTime(scope.row!.saleTime, "{y}-{m}-{d} {h}:{i}");
    }
  },
  {
    prop: "noSaleResidenceTime",
    label: "滞留时间",
    sortable: true,
    width: 160,
    render: scope => {
      return parseTime(scope.row!.noSaleResidenceTime, "{y}-{m}-{d} {h}:{i}");
    }
  },
  {
    prop: "salePrice",
    label: "出售金额",
    sortable: true,
    width: 160,
    search: { el: "input" },
    render: scope => {
      return <span>{getFixed(scope.row.salePrice) || "--"}</span>;
    }
  },
  {
    prop: "accountRecyclerPrice",
    label: "实际回收金额",
    width: 160,
    sortable: true,
    search: { el: "input" },
    render: scope => {
      return <span>{getFixed(scope.row.accountRecyclerPrice) || "--"}</span>;
    }
  },
  {
    prop: "branchId",
    label: "所属门店",
    sortable: true,
    width: 160,
    enum: getAllBranch,
    search: { el: "select" },
    fieldNames: { label: "branchName", value: "id" }
  },
  {
    prop: "accountNumber",
    sortable: true,
    label: "账号",
    width: 160
  },
  {
    prop: "accountPassword",
    sortable: true,
    label: "密码",
    width: 160
  },
  {
    prop: "accountTel",
    sortable: true,
    label: "手机号",
    width: 160,
    search: { el: "input" }
  },
  {
    prop: "accountRemark",
    sortable: true,
    label: "备注",
    width: 160,
    search: { el: "input" }
  },
  {
    prop: "haveSecondary",
    label: "有无二次",
    sortable: true,
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
    sortable: true,
    width: 160,
    enum: [
      { label: "有", value: "0" },
      { label: "无", value: "1" }
    ],
    search: { el: "select" }
  },
  { prop: "accountDesc", sortable: true, label: "账号描述", width: 160, search: { el: "input" } },
  { prop: "operation", label: "操作", fixed: "right", width: 200 }
];
// 账号列表
type AccountObj = { accountNumber: string; accountCode: string; id: number };
const accountList = reactive<AccountObj[]>([]);
const getAllAccountList = async () => {
  const { data } = await getAllBaseAccount({});
  accountList.value = data;
};
getAllAccountList();
// 删除用户信息
const deleteAccount = async (params: Commodity.Account) => {
  await useHandleData(deleteSummary, { id: [params.id] }, `删除编号为【${params.accountCode}】的账户`);
  proTable.value?.getTableList();
};
const getFixed = (str: string) => {
  if (str) {
    return "￥" + parseFloat(str).toFixed(2);
  }
  return "--";
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
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Commodity.Account> = {}) => {
  let accountType = [];
  if (title === "查看") {
  }
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, accountType: accountType },
    api: title === "新增" ? addSummary : title === "查看" ? editSummary : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
onMounted(() => {
  setTimeout(() => {
    // 携带参数page跳转
    const { accountCode, accountType } = route.query;
    const type = accountType ? Number(accountType) : null;
    if (proTable.value) {
      proTable.value.searchParam.accountCode = accountCode;
      proTable.value.searchParam.accountType = type;
      proTable.value?.search();
    }
  }, 300);
});
const onSetPhone = row => {
  const params = {
    accountId: row.id,
    tel: row.accountTel
  };
  pointBury(params)
    .then(() => {})
    .finally(() => {
      row.status = !row.status;
    });
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

.v-red {
  @extend .circle;
  background-color: var(--el-color-error);
}

.v-green {
  @extend .circle;
  background-color: var(--el-color-success);
}
</style>