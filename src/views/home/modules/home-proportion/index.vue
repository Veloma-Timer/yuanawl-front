<template>
  <div class="home-proportion">
    <div class="proportion-item" ref="proportionA"></div>
    <div class="proportion-item" ref="proportionB"></div>
    <div class="proportion-item" ref="proportionC"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
const proportionA = ref<HTMLElement>();
const proportionB = ref<HTMLElement>();
const proportionC = ref<HTMLElement>();
const saleGet = () => {
  let myChart: echarts.ECharts = echarts.init(proportionA.value as HTMLElement);
  let option: echarts.EChartsOption = {
    title: {
      text: "今日销售账号占比",
      left: "left"
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      bottom: 0
    },
    series: [
      {
        type: "pie",
        radius: "70%",
        data: [
          { value: 1048, name: "王者荣耀" },
          { value: 735, name: "项目火影" },
          { value: 580, name: "枪战王者" },
          { value: 484, name: "光影" },
          { value: 300, name: "qq飞车" }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        },
        label: {
          normal: {
            formatter: function (params) {
              return `${params.name}-${params.value}`;
            }
          }
        }
      }
    ]
  };
  useEcharts(myChart, option);
};
// 回收占比
const recoveryGet = () => {
  let myChart: echarts.ECharts = echarts.init(proportionB.value as HTMLElement);
  let option: echarts.EChartsOption = {
    title: {
      text: "今日回收账号占比",
      left: "left"
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      bottom: 0
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data: [
          { value: 1048, name: "王者荣耀" },
          { value: 735, name: "项目火影" },
          { value: 580, name: "枪战王者" },
          { value: 484, name: "光影" },
          { value: 300, name: "qq飞车" }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        },
        label: {
          normal: {
            formatter: function (params) {
              return `${params.name}-${params.value}`;
            }
          }
        }
      }
    ]
  };
  useEcharts(myChart, option);
};
// 工单占比
const orderGet = () => {
  let myChart: echarts.ECharts = echarts.init(proportionC.value as HTMLElement);
  let option: echarts.EChartsOption = {
    title: { text: "工单占比" },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ["已售账号数量总数", "工单数量"],
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
        data: ["一月", "二月", "三月", "五月", "六月"]
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
        name: "已售账号数量总数",
        type: "bar",
        data: [20, 12, 31, 34, 31]
      },
      {
        name: "工单数量",
        type: "bar",
        data: [10, 20, 5, 9, 3]
      }
    ]
  };
  useEcharts(myChart, option);
};
const wholeSetMap = () => {
  saleGet();
  recoveryGet();
  orderGet();
};
onMounted(() => {
  wholeSetMap();
});
</script>
<style scoped lang="scss">
.home-proportion {
  display: flex;
  margin: 0 0 40px;
  .proportion-item {
    width: calc((100% - 80px) / 3);
    height: 455px;
    padding: 10px 20px;
    margin: 0 40px 0 0;
    background: #ffffff;
    border-radius: 25px;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
    &:last-child {
      margin: 0;
    }
  }
}
</style>
