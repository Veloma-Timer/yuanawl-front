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
import { sysAnalysisWork } from "@/api/modules/order";
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
async function getCityData(id: number, date: number) {
  const {
    data: { workTotal, addedToday, passWork, failedWork, handleWorkNumber }
  } = await sysAnalysisWork(id, date);
  saleData.value = [
    {
      title: "工单总数",
      value: workTotal
    },
    {
      title: "今日新增",
      value: addedToday
    },
    {
      title: "审核通过单数",
      value: passWork
    },
    {
      title: "审核未通过单数",
      value: failedWork
    }
  ];
  const toDayX = handleWorkNumber.current.map((item: any) => {
    return item.name;
  });
  const toDayY = handleWorkNumber.current.map((item: any) => {
    return item.value;
  });
  const yesterdayY = handleWorkNumber.preCurrent.map((item: any) => {
    return item.value;
  });
  initEcharts(toDayX, toDayY, yesterdayY);
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

watch(
  () => currentTimeValue.value,
  () => {
    getCityData(tableProps.selectBranchId, currentTimeValue.value);
  }
);
watch(
  () => tableProps.selectBranchId,
  () => {
    getCityData(tableProps.selectBranchId, currentTimeValue.value);
  },
  { deep: true, immediate: true }
);

type BranchObj = { branchName: string; id: number };
const newBranchList = ref<BranchObj[]>([]);
watch(
  () => tableProps.branchList,
  value => {
    if (value) {
      newBranchList.value = value;
      currentCitySelect.value = value[0].branchName;
    }
  }
);

// 渲染图表
// x轴一条 y轴两条数据
function initEcharts(toDayX: any, toDayY: any, yesterdayY: any) {
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
      data: ["昨日", "今日"],
      textStyle: {
        color: "#a1a1a1"
      },
      bottom: "1%"
    },
    grid: {
      left: "3%",
      right: "4%",
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
        name: "昨日",
        type: "line",
        stack: "Total",
        lineStyle: {
          color: "#2ED7FF"
        },
        emphasis: {
          focus: "series"
        },
        data: yesterdayY
      },
      {
        name: "今日",
        type: "line",
        stack: "Total",
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
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
