<template>
  <div class="wrap">
    <div class="left">
      <div class="content">
        <Header title="账号回收" class="header"></Header>
        <el-radio-group v-model="currentTimeSelect" size="large" @change="changeSelectDate" class="date-radio">
          <template v-for="(item, index) in tabDateList" :key="index">
            <el-radio-button :label="item.title" />
          </template>
        </el-radio-group>
        <div ref="echartsRef" class="sale-echarts"></div>
      </div>
    </div>
    <div class="right">
      <el-radio-group v-model="currentCitySelect" size="large" @change="changeCityDate" class="city-radio">
        <template v-for="(item, index) in tabCityList" :key="index">
          <el-radio-button :label="item.title" />
        </template>
      </el-radio-group>
      <div class="sale-content">
        <div class="item" v-for="(item, index) in saleData" :key="index">
          <div class="top">
            <span class="title">{{ item.title }}</span>
            <span class="to-money">￥{{ item.tMoney }}</span>
          </div>
          <div class="bottom">
            <span class="title">昨日全天</span>
            <span class="ys-money">￥{{ item.yMoney }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header/index.vue";
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
const echartsRef = ref<HTMLElement>();

const saleData = ref([
  {
    title: "今日回收金额",
    tMoney: "1666",
    yMoney: "2777"
  },
  {
    title: "客单价",
    tMoney: "3666",
    yMoney: "4777"
  },
  {
    title: "回收订单数",
    tMoney: "5666",
    yMoney: "6777"
  },
  {
    title: "回收用户数",
    tMoney: "7666",
    yMoney: "8777"
  }
]);

const currentTimeSelect = ref("本日");
const tabDateList = ref([
  {
    title: "本日",
    key: "today"
  },
  {
    title: "本周",
    key: "week"
  },
  {
    title: "本月",
    key: "month"
  }
]);
function changeSelectDate(e: string | number | boolean) {
  currentTimeSelect.value = e as string;
}

const currentCitySelect = ref("杭州");
const tabCityList = ref([
  {
    title: "杭州",
    key: "hz"
  },
  {
    title: "信阳",
    key: "xy"
  }
]);
function changeCityDate(e: string | number | boolean) {
  currentCitySelect.value = e as string;
}

onMounted(() => {
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
      data: ["杭州", "信阳"],
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
        data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
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
        name: "杭州",
        type: "line",
        stack: "Total",
        lineStyle: {
          color: "#2ED7FF"
        },
        // areaStyle: {
        //   color: "#2ED7FF"
        // },
        emphasis: {
          focus: "series"
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: "信阳",
        type: "line",
        stack: "Total",
        lineStyle: {
          color: "#63ECFF"
        },
        // areaStyle: {
        //   color: "#63ECFF"
        // },
        emphasis: {
          focus: "series"
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      }
    ]
  };
  useEcharts(myChart, option);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
