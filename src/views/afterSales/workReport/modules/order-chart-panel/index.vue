<template>
  <div class="wrap">
    <div class="left">
      <div class="content">
        <div class="flex flex-row justify-between items-center bg-slate-100 rounded-xl p-2">
          <h6 class="text-sm">工单处理汇总</h6>
          <div>
            <el-date-picker
              v-model="dateRange"
              unlink-panels
              type="daterange"
              format="YYYY-MM-DD"
              range-separator="To"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              start-placeholder="开始时间"
              :shortcuts="shortcuts"
              @change="changeDaterange"
            />
          </div>
        </div>

        <div ref="echartsRef" class="sale-echarts"></div>
      </div>
    </div>
    <div class="right">
      <el-radio-group v-model="branchId" size="large" @change="changeBranch" class="city-radio">
        <el-radio-button v-for="item in newBranchList" :key="item.id" :label="item.id">{{ item.branchName }}</el-radio-button>
      </el-radio-group>
      <div class="sale-content">
        <div class="item cursor-pointer" v-for="(item, index) in saleData" :key="index">
          <table>
            <tr class="top">
              {{
                item.title
              }}
            </tr>
            <tr class="bottom">
              {{
                item.value
              }}
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { workOrderAllBoard, workOrderAllLine } from "@/api/modules/order";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { parseTime, shortcuts } from "@/utils";

const echartsRef = ref<HTMLElement>();
const emit = defineEmits(["change-id"]);

type Props = {
  branchList: any;
  selectBranchId: number;
};

const dateRange = ref<[string, string]>([parseTime(new Date(), "{y}-{m}-{d}"), parseTime(new Date(), "{y}-{m}-{d}")]);

const changeDaterange = (date: [string, string]) => (dateRange.value = date);

const tableProps = withDefaults(defineProps<Props>(), {
  branchList: [],
  selectBranchId: 0
});

const branchId = ref<number>();

const changeBranch = (id: any) => {
  branchId.value = id;
  emit("change-id", id);
};

// 获取门店统计数据
const saleData = ref();

async function getBoradData(id: number, date: [string, string]) {
  const {
    data: { totalNumber, incrementNumber, approveNumber, unApproveNumber }
  } = await workOrderAllBoard(id, date);
  saleData.value = [
    {
      title: "工单总数",
      value: totalNumber
    },
    {
      title: "今日新增",
      value: incrementNumber
    },
    {
      title: "审核通过单数",
      value: approveNumber
    },
    {
      title: "审核未通过单数",
      value: unApproveNumber
    }
  ];
}

async function getLineData(id: number, date: [string, string], { legendName1, legendName2 }: any) {
  const {
    data: { current, preCurrent }
  } = await workOrderAllLine(id, date);
  const toDayX = current.map((item: any) => {
    return item.name;
  });
  const toDayY = current.map((item: any) => {
    return item.value;
  });
  const yesterdayY = preCurrent.map((item: any) => {
    return item.value;
  });
  initEcharts(toDayX, toDayY, yesterdayY, { legendName1, legendName2 });
}

// 日期范围选择
const currentTimeValue = ref(0);

function legendObj() {
  let legend1 = "";
  let legend2 = "";
  if (currentTimeValue.value === 0) {
    legend1 = "昨日";
    legend2 = "今日";
  } else if (currentTimeValue.value === 1) {
    legend1 = "本周";
    legend2 = "上周";
  } else if (currentTimeValue.value === 2) {
    legend1 = "本月";
    legend2 = "上月";
  }
  return {
    legend1,
    legend2
  };
}

const initData = () => {
  const { legend1, legend2 } = legendObj();
  if (!saleData.value) {
    getBoradData(branchId.value!, dateRange.value);
  }
  getLineData(branchId.value!, dateRange.value, { legendName1: legend1, legendName2: legend2 });
};

type BranchObj = { branchName: string; id: number };
const newBranchList = ref<BranchObj[]>([]);
watch(
  () => tableProps.branchList,
  value => {
    if (value) {
      newBranchList.value = value;
      branchId.value = value[0]?.id;
      initData();
    }
  },
  { deep: true, immediate: true }
);

// 渲染图表
// x轴一条 y轴两条数据
const initEcharts = (toDayX: any, toDayY: any, yesterdayY: any, { legendName1, legendName2 }: any) => {
  let myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
  let option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985"
        }
      }
    },
    legend: {
      data: [legendName1, legendName2],
      textStyle: {
        color: "#a1a1a1"
      },
      bottom: "1%"
    },
    grid: {
      left: "2%",
      right: "8px",
      bottom: "13%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: toDayX,
        axisLabel: {
          color: "#a1a1a1"
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: "#a1a1a1"
        }
      }
    ],
    series: [
      {
        name: legendName1,
        type: "line",
        lineStyle: {
          color: "#2ED7FF"
        },
        emphasis: {
          focus: "series"
        },
        data: yesterdayY
      },
      {
        name: legendName2,
        type: "line",
        lineStyle: {
          color: "#63ECFF"
        },
        emphasis: {
          focus: "series"
        },
        data: toDayY
      }
    ]
  };
  useEcharts(myChart, option);
  const chartObserver = new ResizeObserver(() => {
    myChart.resize();
  });
  chartObserver.observe(echartsRef.value as HTMLElement);
};

watch(dateRange, () => initData());
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
