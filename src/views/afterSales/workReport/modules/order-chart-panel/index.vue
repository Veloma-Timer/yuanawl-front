<template>
  <div class="wrap">
    <div class="left">
      <div class="content">
        <Header title="处理工单数量" class="header"></Header>
        <div ref="echartsRef" class="sale-echarts"></div>
      </div>
    </div>
    <div class="right">
      <el-radio-group v-model="currentCitySelect" size="large" @change="changeCityDate" class="city-radio">
        <template v-for="(item, index) in branchList" :key="index">
          <el-radio-button :label="item.branchName" :value="item.id" />
        </template>
      </el-radio-group>
      <div class="sale-content">
        <div class="item" v-for="(item, index) in saleData" :key="index">
          <table>
            <tr class="top">
              <td class="title">{{ item.title1 }}</td>
              <td class="to-money">
                {{ item.value1 }}
              </td>
            </tr>
            <tr class="bottom">
              <td class="title">{{ item.title2 }}</td>
              <td class="to-money">{{ item.value1 }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sysAnalysisWork } from "@/api/modules/order";
import { getAllBranch } from "@/api/modules/set";
import Header from "@/components/Header/index.vue";
import { ref } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
const echartsRef = ref<HTMLElement>();
const emit = defineEmits(["change-id"]);

// 门店数据获取
type BranchObj = { branchName: string; id: number };
const branchList = ref<BranchObj[]>([]);
const currentCitySelect = ref("");
const getAllBranchData = async () => {
  const { data } = await getAllBranch({});
  branchList.value = data?.map(item => {
    return {
      branchName: item.branchName,
      id: item.id
    };
  });
  currentCitySelect.value = branchList.value[0].branchName;
  let selectObj = branchList.value.find(item => item.branchName === currentCitySelect.value);
  let id = selectObj!.id;
  emit("change-id", id);
  getCityData(id);
};
getAllBranchData();

// 门店切换
async function changeCityDate(e: any) {
  currentCitySelect.value = e as string;
  let selectObj = branchList.value.find(item => item.branchName === e);
  let id = selectObj!.id;
  emit("change-id", id);
  getCityData(id);
}

// 获取门店统计数据
const saleData: any = ref([]);
async function getCityData(id: number) {
  const data: any = await sysAnalysisWork(id);
  saleData.value = [
    {
      title1: "工单总数",
      value1: data.workTotal,
      title2: "今日新增",
      value2: data.addedToday
    },
    {
      title1: "审核通过单数",
      value1: data.passWork,
      title2: "审核未通过单数",
      value2: data.failedWork
    }
  ];
  // HistogramValue {
  //   name: string; // X
  //   value: number; // Y
  // }
  const toDayX = data.handleWorkNumber.today.map((item: any) => {
    return item.name;
  });
  const toDayY = data.handleWorkNumber.today.map((item: any) => {
    return item.value;
  });
  const yesterdayY = data.handleWorkNumber.yesterday.map((item: any) => {
    return item.value;
  });
  initEcharts(toDayX, toDayY, yesterdayY);
}

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
    toolbox: {
      feature: {
        saveAsImage: {}
      }
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
