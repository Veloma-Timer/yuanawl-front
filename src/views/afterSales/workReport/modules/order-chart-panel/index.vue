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
        <template v-for="(item, index) in tabCityList" :key="index">
          <el-radio-button :label="item.title" />
        </template>
      </el-radio-group>
      <div class="sale-content">
        <div class="item" v-for="(item, index) in saleData" :key="index">
          <table>
            <tr class="top">
              <td class="title">{{ item.title1 }}</td>
              <td class="to-money">
                <span v-if="item.title1 === '今日工单总价'">￥</span>
                {{ item.value1 }}
              </td>
            </tr>
            <tr class="bottom">
              <td class="title">{{ item.title2 }}</td>
              <td class="to-money">￥{{ item.value1 }}</td>
            </tr>
          </table>
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
    title1: "工单总数",
    value1: "1666",
    title2: "今日新增",
    value2: "0"
  },
  {
    title1: "今日工单总价",
    value1: "1666",
    title2: "昨日全天",
    value2: "0"
  },
  {
    title1: "今日售后工单数",
    value1: "1666",
    title2: "昨日全天",
    value2: "0"
  },
  {
    title1: "今日售后客服数量",
    value1: "1666",
    title2: "昨日全天",
    value2: "0"
  },
  {
    title1: "总处理单数",
    value1: "1666",
    title2: "已处理完结单数",
    value2: "0"
  },
  {
    title1: "审核通过单数",
    value1: "1666",
    title2: "审核未通过单数",
    value2: "0"
  }
]);

const currentCitySelect = ref("杭州");
const tabCityList = ref([
  {
    title: "杭州",
    key: "hz"
  },
  {
    title: "信阳",
    key: "yesterday"
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
        data: ["00:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00"],
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
        data: [120, 132, 101, 134, 90, 230, 210]
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
