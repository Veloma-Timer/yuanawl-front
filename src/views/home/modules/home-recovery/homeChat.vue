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
    <div class="home-group" ref="chatRef"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, toRef, watch } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { setValues } from "@/views/home/modules/homeUtis";

const chatRef = ref<HTMLElement>();
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
const groupGet = (data: any, name: string[]) => {
  nextTick(() => {
    let colorList = ["#0278e6", "#34d160", "#fcdf39", "#f19611", "#00c6ff", "#f76363"];
    let myChart: echarts.ECharts = echarts.init(chatRef.value as HTMLElement);
    let option = {
      tooltip: {
        trigger: "item",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: [
        {
          itemWidth: 10,
          itemHeight: 10,
          icon: "rect",
          orient: "vertical",
          align: "left",
          top: "40%",
          right: "10%",
          itemGap: 18,
          textStyle: {
            fontSize: 12
          },
          data: name
        }
      ],
      grid: {
        left: "3%",
        right: "4%",
        bottom: "6%",
        containLabel: true
      },
      series: [
        {
          type: "pie",
          legendHoverLink: true,
          z: 3,
          center: ["40%", "50%"],
          radius: ["30%", "47%"],
          itemStyle: {
            normal: {
              color: function (params) {
                return colorList[params.dataIndex];
              }
            }
          },
          label: {
            show: true,
            position: "outside",
            formatter: function (parms) {
              return parms.data.name + parms.data.value;
            }
          },
          labelLine: {
            normal: {
              length: 4,
              length2: 50,
              lineStyle: {
                width: 1
              }
            }
          },
          data: data
        }
      ]
    };
    useEcharts(myChart, option);
    const chartObserver = new ResizeObserver(() => {
      myChart.resize();
    });
    chartObserver.observe(chatRef.value as HTMLElement);
  });
};
watch(
  myArrayRef,
  newValue => {
    let name = [];
    name = setValues(newValue, "name");
    const list = newValue?.map(item => {
      return {
        name: item.name,
        value: item.amount
      };
    });
    groupGet(list, name);
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
