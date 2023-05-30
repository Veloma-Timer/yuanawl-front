<template>
  <div class="table-box">
    <ProTable ref="proTable" title="销售金额汇总" :columns="columns" :requestApi="getTableList" :initParam="initParam">
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="toDetail(scope.row.id)"> 详情</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import { getManufactureSheet } from "@/api/modules/data-statistics";
import { useRouter } from "vue-router";
import { ColumnProps } from "@/components/ProTable/interface";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({
  productNo: "", //指令单号
  orderingNo: "", // 生产单号
  stepCode: "", //	 工序编码
  stepName: "", //	 工序名字
  productCode: "", // 产品编码
  productName: "", // 产品名字
  productDate: "", // 生产日期
  batchNo: "", //生产批号
  sorting: "",
  status: "", // 指令单状态
  skipCount: 0,
  maxResultCount: 10
});

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = async (params: any) => {
  const pageNum = proTable.value.pageable.pageNum;

  const skipCount = !pageNum ? 0 : pageNum - 1;

  initParam.maxResultCount = params.pageSize;
  console.log({ ...params, ...initParam, skipCount: skipCount * params.pageSize });
  const data: any = await getManufactureSheet({ ...params, skipCount: skipCount * params.pageSize });

  return {
    data: {
      pageNum,
      pageSize: params.pageSize,
      total: data.totalCount,
      list: data.items
    }
  };
};

const statusMap: Record<string, string> = {
  0: "待生产",
  1: "已分配",
  2: "已领取",
  3: "指令完结",
  4: "终止"
};

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "productNo", label: "指令单号", isShow: false, minWidth: 150, search: { el: "input" } },
  { prop: "orderingNo", label: "生产单号", fixed: "left", minWidth: 150, search: { el: "input" } },
  // {
  //   prop: "productDate",
  //   label: "生产日期",
  //   minWidth: 150,
  //   search: { el: "date-picker" },
  //   render: ({ row }) => formatDate(row.productDate)
  // },
  { prop: "stepCode", label: "工序编码", isShow: false, minWidth: 150 },
  {
    prop: "status",
    label: "生产单状态",
    minWidth: 150,
    search: { el: "select" },
    enum: [
      { label: "待生产", value: "0" },
      { label: "已分配", value: "1" },
      { label: "已领取", value: "2" },
      { label: "指令完结", value: "3" },
      { label: "终止", value: "4" }
    ],
    render: ({ row }) => statusMap[row.status]
  },
  { prop: "productCode", label: "产品编码", isShow: false, minWidth: 150 },
  // {
  //   prop: "productName",
  //   label: "产品名字",
  //   search: { el: "select", props: { filterable: true } },
  //   enum: async () => {
  //     const {
  //       rs: { datas }
  //     } = await getMaterials({ flag: 2 });

  //     return {
  //       data: datas
  //     };
  //   },
  //   fieldNames: { label: "name", value: "number" },
  //   minWidth: 150,
  //   render: ({ row }) => row.productName
  // },
  { prop: "batchNo", label: "	 生产批号", minWidth: 150, search: { el: "input" } },
  { prop: "productDesc", label: "产品描述", minWidth: 150 },
  { prop: "productDeptName", label: "生产车间", minWidth: 150 },
  { prop: "standard", label: "规格", minWidth: 150 },
  { prop: "unit", label: "单位", minWidth: 150 },
  { prop: "bomVersion", label: "BOM版本", minWidth: 150 },
  { prop: "planQuantity", label: "计划数量", minWidth: 150 },
  { prop: "productQuantity", label: "已产数量", minWidth: 150 },
  { prop: "perQuantity", label: "件装量", minWidth: 150 },
  { prop: "sterilizationQuantity", label: "灭菌数量", minWidth: 150 },
  // { prop: 'closeTime', label: '关闭时间', minWidth: 150, render: ({ row }) => formatDate(row.productDate) },
  // { prop: 'finishTime', label: '完成日期', minWidth: 150, render: ({ row }) => formatDate(row.productDate) },
  { prop: "remark", label: "备注", minWidth: 150 },
  { prop: "sterilizationRequired", label: "是否需要灭菌", minWidth: 150 },
  { prop: "sterilizationDuration", label: "灭菌时长", minWidth: 150 },
  { prop: "sterilizationBatchNo", label: "灭菌批号", minWidth: 150 },
  { prop: "productType", label: "产品大类", minWidth: 150 },
  { prop: "requestInspection", label: "是否请验", minWidth: 150 },
  { prop: "inspectionTime", label: "请验时间", minWidth: 150 },
  { prop: "operation", label: "操作", fixed: "right", width: 100 }
];

const router = useRouter();
const toDetail = (id: string) => router.push(`/manufacture/website/manufacture-sheet-detail/${id}`);
</script>

<style scoped lang="scss"></style>
