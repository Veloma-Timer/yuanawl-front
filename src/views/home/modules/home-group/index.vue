<template>
  <div class="home-content" :class="className">
    <div class="home-head flx-justify-between">
      <div class="title">
        {{ props.title }}
      </div>
      <div><slot></slot></div>
    </div>
    <div class="home-group" ref="groupRef"></div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import { ref, watch, toRef } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
// import { setValues } from "@/views/home/modules/homeUtis.js";
const groupRef = ref<HTMLElement>();
const myArrayRef = toRef(props, "listArr");
const props = defineProps({
  listArr: {
    type: Array,
    default: () => []
  },
  className: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  }
});
watch(myArrayRef, () => {
  // let data,
  //   value = [];
  // data = setValues(newValue, "name");
  // value = setValues(newValue, "value");
  groupGet();
});
const groupGet = () => {
  let myChart: echarts.ECharts = echarts.init(groupRef.value as HTMLElement);
  let option: {
    yAxis: {
      axisLabel: { formatter: string };
      min: number;
      max: number;
      name: string;
      interval: number;
      type: string;
    }[];
    xAxis: { data: string[]; axisPointer: { type: string }; type: string }[];
    legend: { data: string[]; bottom: number };
    grid: { left: string; bottom: string; right: string; containLabel: boolean };
    series: (
      | { data: number[]; name: string; tooltip: { valueFormatter: (value) => string }; type: string }
      | { data: number[]; name: string; tooltip: { valueFormatter: (value) => string }; type: string; yAxisIndex: number }
    )[];
    tooltip: { axisPointer: { type: string }; trigger: string };
  } = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ["金额", "数量"],
      bottom: 0
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "6%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: ["王者", "火影", "英雄联盟", "枪战王者", "地下城", "穿越火线"],
        axisPointer: {
          type: "shadow"
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        name: "",
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: "{value}"
        }
      },
      {
        type: "value",
        name: "",
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: "{value}"
        }
      }
    ],
    series: [
      {
        name: "金额",
        type: "bar",
        tooltip: {
          valueFormatter: function (value) {
            return value;
          }
        },
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
      },
      {
        name: "数量",
        type: "line",
        tooltip: {
          valueFormatter: function (value) {
            return value;
          }
        },
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
      }
    ]
  };
  useEcharts(myChart, option);
  const chartObserver = new ResizeObserver(() => {
    myChart.resize();
  });
  chartObserver.observe(groupRef.value as HTMLElement);
};
</script>
<style scoped lang="scss">
.home-content {
  width: 100%;
  height: 465px;
  padding: 20px;
  margin: 32px 0 36px;
  background: #ffffff;
  border-radius: 25px;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
}
.home-head {
  width: 100%;
  height: 30px;
  .title {
    font-size: 16px;
    color: #555555;
    font-weight: normal;
  }
}
.home-group {
  width: 100%;
  height: calc(100% - 30px);
}
.maintain {
  margin: 0 !important;
}
</style>
