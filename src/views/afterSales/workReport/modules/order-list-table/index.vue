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
          <el-button type="primary" :icon="Document" @click="exportData">导出Excel</el-button>
        </div>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="operatorOrder('查看', scope.row)" size="small" v-if="BUTTONS.view" :icon="View">
          查看
        </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { SalesOrder } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getSalesList, getSalesListToday, orderExport } from "@/api/modules/order";
import { CHECK_RESULT, ORDER_STATUS } from "@/public/constant";
import dayjs from "dayjs";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { View, Document } from "@element-plus/icons-vue";
import { saveFile } from "@/utils/file";
import { useRouter } from "vue-router";
import deepcopy from "deepcopy";
const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const { BUTTONS } = useAuthButtons();
const router = useRouter();

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
    label: "账号编码",
    search: { el: "input" },
    width: 180,
    fixed: "left",
    render: scope => {
      return (
        <el-button type="primary" link>
          <router-link to={{ name: "账号汇总", query: { accountCode: scope.row?.accountCode || "" } }}>
            {scope.row?.accountCode || "--"}
          </router-link>
        </el-button>
      );
    }
  },
  // {
  //   prop: "accountNumber",
  //   label: "账号",
  //   width: 180,
  //   render: scope => {
  //     return <span>{scope.row?.account?.accountNumber || "--"}</span>;
  //   }
  // },
  {
    prop: "accountPrice",
    label: "实付金额",
    width: 180,
    render: scope => {
      return <span>{scope.row.accountPrice || "--"}</span>;
    }
  },
  // {
  //   prop: "newHandle",
  //   label: "最新处理客服姓名",
  //   width: 180,
  //   render: scope => {
  //     return <span>{scope.row.newHandle || "--"}</span>;
  //   }
  // },
  // {
  //   prop: "newHandleResult",
  //   label: "最新处理结果",
  //   width: 180,
  //   render: scope => {
  //     return <span>{scope.row.newHandleResult || "--"}</span>;
  //   }
  // },
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
  },
  {
    prop: "reason",
    label: "未通过原因",
    width: 180,
    render: scope => {
      return <span>{scope.row.reason || "--"}</span>;
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

const operatorOrder = (title: string, row: Partial<SalesOrder.ResSalesList> = {}) => {
  const id = row.id;
  if (id) {
    router.push({ name: "工单新增", query: { id } });
  } else {
    router.push({ name: "工单新增" });
  }
};

// 获取表格数据
const getTableList = async (params: any) => {
  let newParams = deepcopy(params);
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
