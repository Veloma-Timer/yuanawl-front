<template>
  <div class="table-box">
    <ProTable ref="proTable" title="销售金额汇总" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="openDrawer('查看', scope.row)" :icon="View">查看</el-button>
      </template>
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-radio-group v-model="currentTimeSelect" size="large" @change="changeCityDate" class="city-radio">
          <template v-for="(item, index) in tabCityList" :key="index">
            <el-radio-button :label="item.title" />
          </template>
        </el-radio-group>
      </template>
    </ProTable>
    <SaleDrawer ref="saleDrawer" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { Data } from "@/api/interface";
import { Commodity } from "@/api/interface/commodity/commodity";
import ProTable from "@/components/ProTable/index.vue";
import SaleDrawer from "@/views/commodity/summary/modules/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { baseAccountSales } from "@/api/modules/order";
import { summaryListHistory, addSummary, editSummary } from "@/api/modules/commodity";
import { getAllList } from "@/api/modules/accountClass";
import { View } from "@element-plus/icons-vue";
import dayjs from "dayjs";
const proTable = ref<ProTableInstance>();
const initParam = reactive({});

type Props = {
  selectBranchId: number;
};
const tableProps = withDefaults(defineProps<Props>(), {
  selectBranchId: 0
});

const getTableList = (params: any) => {
  if (currentTimeSelect.value === "今日销售") {
    return baseAccountSales(params, tableProps.selectBranchId);
  } else {
    return summaryListHistory({ ...params, branchId: tableProps.selectBranchId });
  }
};

// 表格配置项
const columns: ColumnProps<Data.SaleList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "operation", label: "操作", fixed: "right", width: 130 },
  {
    prop: "accountCode",
    label: "订单编号",
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row?.accountCode || "--"}</span>;
    }
  },
  {
    prop: "accountType",
    label: "游戏分类",
    enum: getAllList,
    search: { el: "select" },
    fieldNames: { label: "typeName", value: "id" }
  },
  { prop: "accountTitle", label: "标题" },
  {
    prop: "accountRecyclerPrice",
    label: "回收金额",
    render: scope => {
      return <span>￥{scope.row.accountRecyclerPrice || "-"}</span>;
    }
  },
  {
    prop: "salePrice",
    label: "出售金额",
    render: scope => {
      return <span>￥{scope.row?.salePrice || "--"}</span>;
    }
  },
  {
    prop: "accountPublisher",
    label: "出售人姓名",
    render: scope => {
      return <span>{scope.row?.accountPublisher?.userName || "--"}</span>;
    }
  },
  {
    prop: "saleTime",
    label: "出售时间",
    width: 180,
    render: scope => {
      const time = scope.row?.saleTime;
      return <span>{dayjs(time).format("YYYY-MM-DD HH:mm:ss") || "--"}</span>;
    },
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetime", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  }
];

// 打开 drawer(新增、查看、编辑)
const saleDrawer = ref<InstanceType<typeof SaleDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Commodity.Account> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addSummary : title === "编辑" ? editSummary : undefined,
    getTableList: proTable.value?.getTableList
  };
  saleDrawer.value?.acceptParams(params);
};

const currentTimeSelect = ref("今日销售");
const tabCityList = ref([
  {
    title: "今日销售"
  },
  {
    title: "历史销售"
  }
]);
function changeCityDate(e: string | number | boolean) {
  currentTimeSelect.value = e as string;
  proTable.value?.getTableList();
}

// 监听 selectBranchId
watch(
  () => tableProps.selectBranchId,
  value => {
    if (value) {
      proTable.value?.getTableList();
    }
  }
);
</script>
