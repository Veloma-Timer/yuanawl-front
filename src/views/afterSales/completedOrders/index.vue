<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="售后工单汇总"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" @click="operatorOrder('新增工单')" v-if="BUTTONS.add" :icon="CirclePlus">新增工单</el-button>
        <el-button type="primary" @click="batchAdd('下载')" :icon="Download" plain>下载导入模板</el-button>
        <el-button type="primary" @click="batchAdd('导入')" v-if="BUTTONS.import" :icon="Upload" plain>导入模板</el-button>
        <el-button type="primary" @click="batchExport()" v-if="BUTTONS.export" :icon="Download" plain>导出</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="operatorOrder('查看', row)" v-if="BUTTONS.view" :icon="View">查看</el-button>
        <el-button type="primary" link @click="openCheck(row)" v-if="BUTTONS.check" :icon="EditPen">审核</el-button>
        <el-button type="primary" link @click="delOrder(row.id, row.orderCode)" v-if="BUTTONS.del" :icon="Delete">删除</el-button>
      </template>
    </ProTable>
    <OrderCheck ref="orderCheckRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { SalesOrder } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import OrderCheck from "@/views/afterSales/modules/order-check/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getSalesListFinished, delSalesOrder, orderTemplate, orderUpload, orderExport } from "@/api/modules/order";
import { INSURE_STATUS, CHECK_RESULT } from "@/public/constant";
import { getProblemTypes } from "@/api/modules/order";
import { useHandleData } from "@/hooks/useHandleData";
import dayjs from "dayjs";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import { CirclePlus, Delete, EditPen, Download, Upload, View } from "@element-plus/icons-vue";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { saveFile } from "@/utils/file";
import { useRoute, useRouter } from "vue-router";
const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const { BUTTONS } = useAuthButtons();
const route = useRoute();
const router = useRouter();
const getTableList = (params: any) => {
  return getSalesListFinished(params);
};

// 表格配置项
const columns: ColumnProps<SalesOrder.ResSalesList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "operation", label: "操作", fixed: "right", width: 220 },
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
    width: 180,
    search: { el: "input" },
    render: scope => {
      return (
        <el-button type="primary" link>
          <router-link to={{ name: "账号汇总", query: { accountCode: scope.row?.accountId || "" } }}>
            {scope.row?.account?.accountCode || "--"}
          </router-link>
        </el-button>
      );
    }
  },
  {
    prop: "problemTypeId",
    label: "问题类型",
    enum: async () => {
      const {
        data: { problemTypes }
      } = await getProblemTypes();
      return { data: problemTypes };
    },
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" },
    width: 180
  },
  {
    prop: "reportPersonId",
    label: "上报人姓名",
    search: { el: "input" },
    width: 180,
    render: scope => {
      return <span>{scope.row.reportPersonId || "--"}</span>;
    }
  },
  {
    prop: "createdTime",
    label: "上报日期",
    width: 180,
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetime", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    },
    render: scope => {
      const time = scope.row?.createdTime;
      return <span>{dayjs(time).format("YYYY-MM-DD HH:mm:ss") || "--"}</span>;
    }
  },
  {
    prop: "insure",
    label: "是否投保",
    width: 180,
    search: { el: "select", props: { filterable: true } },
    enum: [
      {
        label: "否",
        value: 0
      },
      {
        label: "是",
        value: 1
      }
    ],
    render: scope => {
      return <span>{INSURE_STATUS[scope.row.insure as any] || "--"}</span>;
    }
  },
  {
    prop: "orderStar",
    label: "工单星级",
    search: { el: "input" },
    width: 180,
    render: scope => {
      return <el-rate v-model={scope.row.orderStar} max={3} disabled />;
    }
  },
  {
    prop: "handleTime",
    label: "处理时效",
    search: { el: "input" },
    width: 180,
    render: scope => {
      return <span>{scope.row.handleTime || "--"}</span>;
    }
  },
  {
    prop: "remark",
    label: "留言",
    render: scope => {
      return <span>{scope.row.remark || "-"}</span>;
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

const operatorOrder = (title: string, row: Partial<SalesOrder.ResSalesList> = {}) => {
  const id = row.id;
  if (id) {
    router.push({ name: "工单新增", query: { id } });
  } else {
    router.push({ name: "工单新增" });
  }
};

const orderCheckRef = ref<any>(null);
const openCheck = (row: any) => {
  orderCheckRef.value?.openDialog({ row, getTableList: proTable.value?.getTableList });
};

const delOrder = async (id: number, orderCode: string) => {
  await useHandleData(delSalesOrder, id, `删除工单编号【${orderCode}】这条数据`);
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: title === "下载" ? `${title}工单批量导入模板` : "工单批量导入",
    status: title === "下载",
    tempApi: orderTemplate,
    updateApi: orderUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 批量导出工单信息
const batchExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await orderExport(obj);
  saveFile(data, "工单报表");
};
onMounted(() => {
  setTimeout(() => {
    // 携带参数page跳转
    const orderCode = route.query.orderCode;
    if (proTable.value) {
      proTable.value.searchParam.orderCode = orderCode;
      proTable.value?.search();
    }
  }, 300);
});
</script>

<style scoped lang="scss">
:deep(.el-upload) {
  display: inline-block;
}
.up-btn {
  display: inline-block;
  margin: 0 10px;
}
</style>
