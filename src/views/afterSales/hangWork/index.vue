<template>
  <div class="table-box">
    <ProTable ref="proTable" title="杭州工单" :columns="columns" :request-api="getTableList" :init-param="initParam">
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
// import { getAllBranch } from "@/api/modules/set";
import { getSalesList, delSalesOrder, orderTemplate, orderUpload, orderExport } from "@/api/modules/order";
import { CHECK_RESULT, ORDER_STATUS, INSURE_STATUS } from "@/public/constant";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { CirclePlus, Delete, EditPen, Download, Upload, View } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import { saveFile } from "@/utils/file";
import { useRouter } from "vue-router";
const proTable = ref<ProTableInstance>();
const { BUTTONS } = useAuthButtons();

const router = useRouter();

// 固定
const initParam = reactive({ branchId: 1 });

const getTableList = (params: any) => {
  return getSalesList(params);
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
    label: "账号编码",
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
    prop: "userCompensationPrice",
    label: "用户赔付金额",
    width: 180,
    render: scope => {
      return <span>{scope.row.userCompensationPrice || "--"}</span>;
    }
  },
  {
    prop: "platformCompensationPrice",
    label: "平台赔付金额",
    width: 180,
    render: scope => {
      return <span>{scope.row.platformCompensationPrice || "--"}</span>;
    }
  },
  {
    prop: "reportPerson",
    label: "上报人姓名",
    width: 180,
    render: scope => {
      return <span>{scope.row.reportPerson || "--"}</span>;
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
    prop: "handleTimes",
    label: "处理次数",
    width: 180,
    render: scope => {
      return <span>{scope.row.handleTimes || "-"}</span>;
    }
  },
  {
    prop: "insure",
    label: "是否投保",
    width: 180,
    render: scope => {
      return <span>{INSURE_STATUS[scope.row.insure as any] || "--"}</span>;
    }
  },
  {
    prop: "recycleBranch",
    label: "回收店铺",
    width: 180,
    render: scope => {
      return <span>{scope.row.recycleBranch || "--"}</span>;
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
    prop: "handleTime",
    label: "处理时效",
    width: 180,
    render: scope => {
      return <span>{scope.row.handleTime || "--"}</span>;
    }
  },
  {
    prop: "orderStar",
    label: "工单星级",
    width: 180,
    render: scope => {
      return <el-rate v-model={scope.row.orderStar} max={5} disabled />;
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
  // {
  //   prop: "branch",
  //   label: "店铺",
  //   width: 180,
  //   enum: getAllBranch,
  //   search: { el: "select", props: { filterable: true } },
  //   fieldNames: { label: "branchName", value: "id" }
  // }
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
</script>
