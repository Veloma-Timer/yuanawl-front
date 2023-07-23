<template>
  <div class="home-content" :class="className">
    <div class="home-head flx-justify-between">
      <div class="title">
        {{ props.title }}
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
    <div class="home-group" ref="groupRef"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, toRef } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { setValues } from "@/views/home/modules/homeUtis";
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
  branchName: {
    type: String,
    default: "今日"
  },
  title: {
    type: String,
    default: ""
  }
});
const getFixed = (str: string) => {
  console.log(str);
  if (str) {
    return "￥" + parseFloat(str).toFixed(2);
  }
  return "--";
};
const groupGet = (amount: number[], name: string[], ringAmount: number[], yoyAmount: number[]) => {
  nextTick(() => {
    let myChart: echarts.ECharts = echarts.init(groupRef.value as HTMLElement);
    let nameValue = `${props.branchName}数量`;
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ["完成数量", nameValue, "往年"],
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
          data: name,
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
          name: "完成数量",
          type: "line",
          tooltip: {
            valueFormatter: function (value) {
              return getFixed(value);
            }
          },
          data: ringAmount
        },
        {
          name: nameValue,
          type: "line",
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          data: amount
        },
        {
          name: "往年",
          type: "line",
          tooltip: {
            valueFormatter: function (value) {
              return getFixed(value);
            }
          },
          data: yoyAmount
        }
      ]
    };
    useEcharts(myChart, option);
    const chartObserver = new ResizeObserver(() => {
      myChart.resize();
    });
    chartObserver.observe(groupRef.value as HTMLElement);
  });
};
watch(
  myArrayRef,
  newValue => {
    let amount,
      name,
      ringAmount,
      ringMoney,
      yoyMoney,
      yoyAmount,
      money = [];
    name = setValues(newValue, "name"); // x轴
    amount = setValues(newValue, "amount"); // 当前数量
    money = setValues(newValue, "money"); // 当前时间金额
    ringAmount = setValues(newValue, "ringAmount"); // 环比数量
    ringMoney = setValues(newValue, "ringMoney"); // 环比数量
    yoyMoney = setValues(newValue, "yoyMoney"); // 同比金额
    yoyAmount = setValues(newValue, "yoyAmount"); // 同比金额
    groupGet(amount, name, ringAmount, yoyAmount);
  },
  { deep: true, immediate: true }
);
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
