<template>
  <div class="home-group" :class="className" ref="groupRef"></div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
const groupRef = ref<HTMLElement>();
const props = defineProps({
  title: String,
  className: String
});
const groupGet = () => {
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
        data: ["一月", "二月", "三月", "五月", "六月", "一月", "二月", "三月", "五月", "六月"]
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
        data: [20, 12, 31, 34, 31, 20, 12, 31, 34, 31]
      }
    ]
  };
  useEcharts(myChart, option);
};
onMounted(() => {
  groupGet();
});
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
