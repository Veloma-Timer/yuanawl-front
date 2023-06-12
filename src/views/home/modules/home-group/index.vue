<template>
  <div>
    <div class="home-group" :class="className" ref="groupRef"></div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import { ref, watch, toRef } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { setValues } from "@/views/home/modules/homeUtis.js";
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
watch(myArrayRef, newValue => {
  let data,
    value = [];
  data = setValues(newValue, "name");
  value = setValues(newValue, "value");
  groupGet(data, value);
});
const groupGet = (data, value) => {
  let myChart: echarts.ECharts = echarts.init(groupRef.value as HTMLElement);
  let option: echarts.EChartsOption = {
    title: { text: props.title },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ["售出"],
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
        data: data
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: "{value}"
        }
      }
    ],
    series: [
      {
        name: "售出",
        type: "bar",
        data: value
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
.home-group {
  width: 100%;
  height: 426px;
  padding: 10px 20px;
  margin: 32px 0 36px;
  background: #ffffff;
  border-radius: 25px;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
}
</style>
