<template>
  <div class="wrap">
    <div class="left">
      <div class="content">
        <Header title="处理工单数量" class="header"></Header>
        <el-radio-group v-model="currentTimeLabel" size="large" @change="changeSelectDate" class="date-radio">
          <template v-for="(item, index) in tabCityList" :key="index">
            <el-radio-button :label="item.title" />
          </template>
        </el-radio-group>
        <div ref="echartsRef" class="sale-echarts"></div>
      </div>
    </div>
    <div class="right">
      <el-radio-group v-model="currentCitySelect" size="large" @change="changeCityDate" class="city-radio">
        <template v-for="(item, index) in newBranchList" :key="index">
          <el-radio-button :label="item.branchName" :value="item.id" />
        </template>
      </el-radio-group>
      <div class="sale-content">
        <div class="item" v-for="(item, index) in saleData" :key="index">
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
// import { getAllBranch } from "@/api/modules/set";
import Header from "@/components/Header/index.vue";
import { ref } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
const echartsRef = ref<HTMLElement>();
const emit = defineEmits(["change-id"]);

type Props = {
  branchList: any;
  selectBranchId: number;
};
const tableProps = withDefaults(defineProps<Props>(), {
  branchList: [],
  selectBranchId: 0
});

const currentCitySelect = ref("");

// 门店切换
async function changeCityDate(e: any) {
  currentCitySelect.value = e as string;
  let selectObj = tableProps.branchList.find((item: { branchName: any }) => item.branchName === e);
  emit("change-id", selectObj.id);
}

// 获取门店统计数据
const saleData: any = ref([]);
async function getBoradData(id: number, date: number) {
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

async function getLineData(id: number, date: number, { legendName1, legendName2 }: any) {
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
const currentTimeLabel = ref("本日");
const currentTimeValue = ref(0);
const tabCityList = ref([
  {
    title: "本日"
  },
  {
    title: "本周"
  },
  {
    title: "本月"
  }
]);
function changeSelectDate(e: any) {
  currentTimeLabel.value = e;
  if (e === "本日") {
    currentTimeValue.value = 0;
  } else if (e === "本周") {
    currentTimeValue.value = 1;
  } else if (e === "本月") {
    currentTimeValue.value = 2;
  }
}

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

watch(
  () => currentTimeValue.value,
  value => {
    if (value || currentTimeValue.value === 0) {
      const { legend1, legend2 } = legendObj();
      getBoradData(tableProps.selectBranchId, currentTimeValue.value);
      getLineData(tableProps.selectBranchId, currentTimeValue.value, { legendName1: legend1, legendName2: legend2 });
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => currentCitySelect.value,
  value => {
    if (value) {
      const { legend1, legend2 } = legendObj();
      getBoradData(tableProps.selectBranchId, currentTimeValue.value);
      getLineData(tableProps.selectBranchId, currentTimeValue.value, { legendName1: legend1, legendName2: legend2 });
    }
  }
);

type BranchObj = { branchName: string; id: number };
const newBranchList = ref<BranchObj[]>([]);
watch(
  () => tableProps.branchList,
  value => {
    if (value) {
      newBranchList.value = value;
      currentCitySelect.value = value[0]?.branchName;
    }
  },
  { deep: true, immediate: true }
);

// 渲染图表
// x轴一条 y轴两条数据
function initEcharts(toDayX: any, toDayY: any, yesterdayY: any, { legendName1, legendName2 }: any) {
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
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
