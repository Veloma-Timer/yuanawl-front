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
        <el-button type="primary" :icon="Download" plain @click="batchAdd('下载')">下载销售模板</el-button>
        <el-button v-if="BUTTONS.import" type="primary" :icon="Download" plain @click="batchAdd('导入')">导入模板</el-button>
        <el-button v-if="BUTTONS.export" type="primary" :icon="Upload" plain @click="onExport">导出</el-button>
      </template>
      <!-- Expand -->
      <template #salePrice="scope">
        {{ getFixed(scope.row.salePrice) || "--" }}
      </template>
      <!-- usernameHeader -->
      <!-- createTime -->
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button
          v-if="BUTTONS.add && scope.row.isPublish === '1'"
          type="primary"
          link
          :icon="CirclePlus"
          @click="openDrawer('新增', scope.row)"
        >
          销售
        </el-button>
        <el-button type="primary" link :icon="View" v-if="BUTTONS.view" @click="openDrawer('查看', scope.row)">查看</el-button>
        <!--        <el-button type="primary" link :icon="Delete" v-if="BUTTONS.del" @click="deleteAccount(scope.row)">删除</el-button>-->
      </template>
    </ProTable>
    <saleDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { useHandleData } from "@/hooks/useHandleData";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import saleDrawer from "@/views/commodity/saleList/modules/saleDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Download, Upload, View } from "@element-plus/icons-vue";
import {
  addSales,
  getSalesList,
  deleteSummary,
  editSales,
  summaryExport,
  salesTemplate,
  salesUpload
} from "@/api/modules/commodity";
import { Commodity } from "@/api/interface/commodity/commodity";
import { saveFile } from "@/utils/file";
import { parseTime } from "@/utils";
import { getUserAll } from "@/api/modules/user";
import { sellKeyMap } from "@/api/modules/dictionary";
import { useUserStore } from "@/stores/modules/user";
// import { useRoute } from "vue-router";
// const route = useRoute();
// 跳转详情页
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
const { BUTTONS } = useAuthButtons();
const userObj = useUserStore();
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
const getFixed = (str: string) => {
  if (str) {
    return "￥" + parseFloat(str).toFixed(2);
  }
  return "--";
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getSalesList(newParams);
};
const batchAdd = (title: string) => {
  const params = {
    title: `${title}销售列表模板`,
    status: title === "下载",
    tempApi: salesTemplate,
    updateApi: salesUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Commodity.Sales>[] = [
  { type: "selection", width: 55, fixed: true },
  { prop: "accountCode", label: "账号编号", fixed: true, width: 160, search: { el: "input" } },
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
    label: "密保手机",
    width: 180,
    search: { el: "input" }
  },
  { prop: "campId", label: "营地号", width: 160, search: { el: "input" } },
  { prop: "campId", label: "游戏区服", width: 160, search: { el: "input" } },
  { prop: "campId", label: "回收价格", width: 160, search: { el: "input" } },
  { prop: "recycleOrder", label: "回收订单号", width: 160, search: { el: "input" } },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    width: 160,
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "accountRecyclerTime",
    label: "回收日期",
    width: 180,
    render: scope => {
      return parseTime(scope.row?.accountRecyclerTime, "{y}-{m}-{d} {h}:{i}");
    }
  },
  { prop: "recycleRemark", label: "回收备注", width: 160 },
  {
    prop: "salePeopleId",
    width: 160,
    label: "出售人姓名",
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "saleTime",
    label: "出售时间",
    width: 180,
    render: scope => {
      return parseTime(scope.row?.saleTime, "{y}-{m}-{d} {h}:{i}:{s}");
    }
  },
  { prop: "salePrice", label: "出售金额", width: 160, search: { el: "input" } },
  {
    prop: "noSaleResidenceTime",
    label: "滞留时间",
    width: 160,
    render: scope =>
      scope.row.isSales == "1" ? "--" : scope.row!.noSaleResidenceTime ? scope.row!.noSaleResidenceTime + "天" : "--"
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
    prop: "isPublish",
    label: "发布状态",
    search: { el: "select" },
    width: 160,
    enum: [
      { label: "未发布", value: "0" },
      { label: "已发布", value: "1" }
    ],
    render: ({ row }) => {
      const status = row.isPublish === "0";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "未发布" : "已发布"}</span>
        </div>
      );
    }
  },
  {
    prop: "isSales",
    label: "销售状态",
    search: { el: "select" },
    width: 160,
    enum: [
      { label: "未销售", value: "0" },
      { label: "已销售", value: "1" }
    ],
    render: ({ row }) => {
      const status = row.isSales === "0";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "未销售" : "已销售"}</span>
        </div>
      );
    }
  },
  {
    prop: "salePlatformId",
    width: 160,
    label: "出售渠道",
    enum: async () => {
      const {
        data: { publishPlatform = [] }
      } = await sellKeyMap();
      return { data: publishPlatform };
    },
    search: { el: "select" }
  },
  { prop: "buyerTel", label: "买家手机号", width: 160, search: { el: "input" } },
  { prop: "salesRemark", label: "销售备注", width: 160 },
  { prop: "operation", label: "操作", fixed: "right", width: 260 }
];

// 删除用户信息
const deleteAccount = async (params: Commodity.Account) => {
  await useHandleData(deleteSummary, { id: [params.id] }, `删除编号为【${params.accountCode}】的账户`);
  proTable.value?.getTableList();
};

const onExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await summaryExport(obj);
  saveFile(data, "销售列表导出");
};

// 重置用户密码
// 切换用户状态
// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
// const batchAdd = (title: string) => {
//   const params = {
//     title: `${title}账号`,
//     status: title === "下载",
//     tempApi: summaryTemplate,
//     updateApi: summaryUpload,
//     getTableList: proTable.value?.getTableList
//   };
//   dialogRef.value?.acceptParams(params);
// };
const date = new Date();
const time = parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}");
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof saleDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Commodity.Sales> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: {
      ...row,
      salePrice: Number(row.salePrice),
      accountCode: row.accountCode,
      saleTime: time,
      salePeopleId: userObj.userInfo.id,
      salePlatformId: title === "查看" ? userObj.userInfo.id : null
    },
    api: title === "新增" ? addSales : title === "查看" ? editSales : undefined,
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

.v-red {
  @extend .circle;
  background-color: var(--el-color-error);
}

.v-green {
  @extend .circle;
  background-color: var(--el-color-success);
}
</style>
