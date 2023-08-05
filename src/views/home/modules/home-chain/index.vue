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

const myArrayRef = toRef(props, "listArr");

const getFixed = (str: string) => {
  if (str) {
    return "￥" + parseFloat(str).toFixed(2);
  }
  return "--";
};
const groupGet = (
  money: number[],
  name: string[],
  amount: number[],
  ringMoney: number[],
  yoyMoney: number[],
  ringAmount: number[],
  yoyAmount: number[]
) => {
  nextTick(() => {
    const myChart: echarts.ECharts = echarts.init(groupRef.value as HTMLElement);
    const nameValue = `${props.branchName}数量`;
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: [nameValue, `${props.branchName}金额`, "环比数量", "环比金额", "同比数量", "同比金额"],
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
          interval: 2000,
          axisLabel: {
            formatter: "{value}"
          }
        },
        {
          type: "value",
          name: "",
          min: 0,
          interval: 20,
          axisLabel: {
            formatter: "{value}"
          }
        }
      ],
      series: [
        {
          name: nameValue,
          type: "line",
          tooltip: {
            valueFormatter: (value: string) => value
          },
          data: amount
        },
        {
          name: `${props.branchName}金额`,
          type: "bar",
          tooltip: {
            valueFormatter: (value: string) => getFixed(value)
          },
          data: money
        },

        {
          name: "环比数量",
          type: "line",
          tooltip: {
            valueFormatter: (value: string) => value
          },
          data: ringAmount
        },
        {
          name: "环比金额",
          type: "bar",
          tooltip: {
            valueFormatter: (value: string) => getFixed(value)
          },
          data: ringMoney
        },

        {
          name: "同比数量",
          type: "line",
          tooltip: {
            valueFormatter: (value: string) => value
          },
          data: yoyAmount
        },
        {
          name: "同比金额",
          type: "bar",
          tooltip: {
            valueFormatter: (value: string) => getFixed(value)
          },
          data: yoyMoney
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
    groupGet(money, name, amount, ringAmount, yoyMoney, ringMoney, yoyAmount);
  },
  { deep: true, immediate: true }
);
</script>
<style scoped lang="scss">
.home-content {
  width: 100%;
  height: 465px;
  padding: 20px;
  background: #ffffff;
  border-radius: 4px;
  //box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
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
