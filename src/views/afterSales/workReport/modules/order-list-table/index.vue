<template>
  <div class="table-box">
    <ProTable ref="proTable" title="工单处理报表" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <div class="table-header">
          <el-radio-group v-model="currentTimeSelect" @change="changeSelectDate" class="date-radio">
            <template v-for="(item, index) in tabDateList" :key="index">
              <el-radio-button :label="item.title" />
            </template>
          </el-radio-group>
          <el-button type="primary" @click="exportData">导出</el-button>
        </div>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="openDrawer('查看', scope.row)" size="small" v-if="BUTTONS.view" :icon="View">
          查看
        </el-button>
      </template>
    </ProTable>
    <OrderDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { SalesOrder } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import OrderDrawer from "@/views/afterSales/orderSummary/modules/order-drawer/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getSalesList, getSalesListToday, addSalesList, editSalesList, orderExport } from "@/api/modules/order";
import { CHECK_RESULT, ORDER_STATUS } from "@/public/constant";
import dayjs from "dayjs";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { View } from "@element-plus/icons-vue";
import { saveFile } from "@/utils/file";
const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const { BUTTONS } = useAuthButtons();

type Props = {
  selectBranchId: number;
};
const tableProps = withDefaults(defineProps<Props>(), {
  selectBranchId: undefined
});

// 表格配置项
const columns: ColumnProps<SalesOrder.ResSalesList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "operation", label: "操作", fixed: "right", width: 100 },
  {
    prop: "orderCode",
    label: "工单编号",
    search: { el: "input" },
    width: 180,
    render: scope => {
      return <span>{scope.row.orderCode || "--"}</span>;
    }
  },
  {
    prop: "accountCode",
    label: "账号编号",
    search: { el: "input" },
    width: 180,
    render: scope => {
      return (
        <el-button type="primary" link>
          <router-link to={{ name: "账号汇总", query: { accountCode: scope.row?.account?.accountCode || "" } }}>
            {scope.row?.account?.accountCode || "--"}
          </router-link>
        </el-button>
      );
    }
  },
  {
    prop: "accountNumber",
    label: "账号",
    width: 180,
    render: scope => {
      return <span>{scope.row?.account?.accountNumber || "--"}</span>;
    }
  },
  {
    prop: "accountPrice",
    label: "实付金额",
    width: 180,
    render: scope => {
      return <span>{scope.row.accountPrice || "--"}</span>;
    }
  },
  {
    prop: "newHandle",
    label: "最新处理客服姓名",
    width: 180,
    render: scope => {
      return <span>{scope.row.newHandle || "--"}</span>;
    }
  },
  {
    prop: "newHandleResult",
    label: "最新处理结果",
    width: 180,
    render: scope => {
      return <span>{scope.row.newHandleResult || "--"}</span>;
    }
  },
  {
    prop: "submitOrderTime",
    label: "提交工单时间",
    width: 180,
    render: scope => {
      const time = scope.row?.submitOrderTime;
      return <span>{dayjs(time).format("YYYY-MM-DD HH:mm:ss") || "--"}</span>;
    }
  },
  {
    prop: "newHandleTime",
    label: "最新处理时间",
    width: 180,
    render: scope => {
      const time = scope.row?.newHandleTime;
      return <span>{dayjs(time).format("YYYY-MM-DD HH:mm:ss") || "--"}</span>;
    }
  },
  {
    prop: "orderStar",
    label: "工单星级",
    width: 180,
    render: scope => {
      return <el-rate v-model={scope.row.orderStar} max={3} disabled />;
    }
  },
  {
    prop: "orderStatus",
    label: "状态",
    enum: [
      {
        label: "待处理",
        value: "0"
      },
      {
        label: "已处理",
        value: "1"
      }
    ],
    width: 180,
    search: { el: "select", props: { filterable: true } },
    render: scope => {
      return <span>{ORDER_STATUS[scope.row.orderStatus as any] || "--"}</span>;
    }
  },
  {
    prop: "orderChecker",
    label: "审核人",
    width: 180,
    render: scope => {
      return <span>{scope.row.orderChecker || "--"}</span>;
    }
  },
  {
    prop: "checkerResult",
    label: "审核结果",
    width: 180,
    search: { el: "select", props: { filterable: true } },
    enum: [
      {
        label: "未通过",
        value: "0"
      },
      {
        label: "通过",
        value: "1"
      }
    ],
    render: scope => {
      return <span>{CHECK_RESULT[scope.row.checkerResult as any] || "--"}</span>;
    }
  }
];
const currentTimeSelect = ref("今日工单");
const tabDateList = ref([
  {
    title: "今日工单"
  },
  {
    title: "历史工单"
  }
]);

function changeSelectDate(e: string | number | boolean) {
  currentTimeSelect.value = e as string;
}

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof OrderDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<SalesOrder.ResSalesList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增工单" ? addSalesList : title === "查看" ? editSalesList : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 获取表格数据
const getTableList = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.branchId = tableProps.selectBranchId;
  if (!newParams.branchId) {
    return false;
  }
  if (currentTimeSelect.value === "今日工单") {
    return await getSalesListToday(newParams);
  } else {
    return await getSalesList(newParams);
  }
};

// 监听 selectBranchId
watch(
  () => tableProps.selectBranchId,
  () => {
    proTable.value?.getTableList();
  }
);

// 监听 currentTimeSelect.value
watch(
  () => currentTimeSelect.value,
  () => {
    proTable.value?.getTableList();
  }
);

const exportData = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await orderExport(obj);
  saveFile(data, "工单报表");
};
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: center;
  .date-radio {
    margin-right: 60px;
    transform: translateY(-7px);
  }
  .el-button {
    height: 31px;
  }
}
</style>
