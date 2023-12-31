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
        <div v-if="props?.isShowTableHeadeBtn">
          <el-button type="primary" v-if="BUTTONS.export" :icon="Document" plain @click="batchDelete(scope.selectedListIds)">
            导出Excel
          </el-button>
        </div>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <!-- createTime -->
      <!-- 表格操作 -->
      <!--<template #operation="scope">-->
      <!--<el-button type="primary" link :icon="View" @click="openDrawer('编辑', scope.row)">编辑</el-button>-->
      <!--        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>-->
      <!--</template>-->
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import UserDrawer from "@/views/commodity/unsoldList/modules/UnsoldDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Document } from "@element-plus/icons-vue";
import { deleteUser, getSalesUsers, getRecycleUsers, getPublishUsers } from "@/api/modules/user";
import { summaryList, addSummary, editSummary } from "@/api/modules/commodity";
import { getAllList } from "@/api/modules/accountClass";
import { parseTime, shortcuts, getFixed } from "@/utils";
import { getAccountCodeAndId, getAllBranch } from "@/api/modules/set";
import { Commodity } from "@/api/interface/commodity/commodity";
import deepcopy from "deepcopy";

const { BUTTONS } = useAuthButtons();
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ isSales: "1" });

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
  return summaryList(newParams);
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
    fixed: "left",
    enum: getAccountCodeAndId,
    search: {
      el: "select-v2",
      props: {
        filterable: true,
        "allow-create": true
      },
      slotName: true
    },
    fieldNames: { label: "accountCode", value: "accountCode" },
    render: ({ row }) => {
      const status = row.isWorkOrder === "1";
      return (
        <div class="cursor-pointer">
          <div class="cursor-pointer">
            {status ? (
              <router-link to={{ name: "工单新增", query: { id: row?.orderId || "" } }}>
                <span class="red">{row.accountCode}</span>
              </router-link>
            ) : (
              <span>{row.accountCode}</span>
            )}
          </div>
        </div>
      );
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
    search: {
      el: "select"
    },
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
    prop: "accountRecyclerId",
    label: "回收人",
    width: 160,
    enum: getRecycleUsers,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "accountPublisherId",
    label: "发布人",
    enum: getPublishUsers,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "salePeopleId",
    label: "出售人",
    width: 160,
    enum: getSalesUsers,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "saleTime",
    label: "出售时间",
    width: 160,
    render: scope => {
      return parseTime(scope.row?.saleTime, "{y}-{m}-{d} {h}:{i}");
    }
  },
  {
    prop: "salePrice",
    label: "出售金额",
    width: 160,
    render: scope => {
      return <span>{getFixed(scope.row?.salePrice) || "--"}</span>;
    }
  },
  {
    prop: "accountRecyclerPrice",
    label: "实际回收金额",
    width: 160,
    render: scope => {
      return getFixed(scope.row?.accountRecyclerPrice!);
    }
  },
  {
    prop: "branchId",
    label: "所属问店",
    width: 160,
    enum: getAllBranch,
    search: { el: "select" },
    fieldNames: { label: "branchName", value: "id" }
  },
  // { prop: "accountNumber", label: "账号", width: 160 },
  { prop: "accountPassword", label: "密码", width: 160 },
  { prop: "accountTel", label: "手机号", width: 160 },
  { prop: "accountRemark", label: "备注", width: 160 },
  {
    prop: "noSaleResidenceTime",
    label: "滞留时间",
    width: 160,
    render: scope => {
      return (scope.row?.noSaleResidenceTime || 0) + "天";
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
    sortable: true,
    isShow: false,
    label: "时间区间",
    search: {
      el: "date-picker",
      props: { type: "daterange", unlinkPanels: true, shortcuts: shortcuts, valueFormat: "YYYY-MM-DD" }
    }
  }
  // { prop: "operation", label: "操作", fixed: "right", width: 200 }
];

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "导出用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "编辑",
    row: { ...row },
    api: title === "新增" ? addSummary : title === "编辑" ? editSummary : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params as any);
};

// 数据统计引用的本页面 需要隐藏部分
const props = withDefaults(
  defineProps<{
    isShowTableHeadeBtn?: boolean;
  }>(),
  {
    isShowTableHeadeBtn: true
  }
);
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
.red {
  color: var(--el-color-error);
}

.green {
  color: var(--el-color-success);
}
</style>
