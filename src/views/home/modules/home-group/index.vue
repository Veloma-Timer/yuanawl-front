<template>
  <div class="home-content mb-[20px]" :class="className">
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
  title: {
    type: String,
    default: ""
  }
});
const getFixed = (str: string) => {
  if (str) {
    return "￥" + parseFloat(str).toFixed(2);
  }
  return "--";
};
const groupGet = (data: number[], name: string[], value: number[]) => {
  nextTick(() => {
    let myChart: echarts.ECharts = echarts.init(groupRef.value as HTMLElement);
    let option = {
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
          name: "金额",
          type: "bar",
          tooltip: {
            valueFormatter: function (value) {
              return getFixed(value);
            }
          },
          data: value
        },
        {
          name: "数量",
          type: "line",
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          data
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
    let data,
      name,
      value = [];
    data = setValues(newValue, "amount");
    name = setValues(newValue, "name");
    value = setValues(newValue, "money");
    groupGet(data, name, value);
  },
  { deep: true, immediate: true }
);
</script>
<style scoped lang="scss">
.home-content {
  width: 100%;
  height: 465px;
  padding: 20px;
  margin-top: 20px;
  background: #ffffff;
  border-radius: 4px;
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
