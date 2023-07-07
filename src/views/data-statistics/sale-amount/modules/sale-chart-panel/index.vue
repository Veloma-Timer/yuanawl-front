<template>
  <div class="wrap">
    <div class="left">
      <div class="content">
        <el-radio-group v-model="currentTimeSelect" size="large" @change="changeSelectDate" class="date-radio">
          <template v-for="item in tabDateList" :key="item">
            <el-radio-button :label="item" />
          </template>
        </el-radio-group>
        <div ref="echartsRef" class="sale-echarts"></div>
      </div>
    </div>
    <div class="right">
      <el-radio-group v-model="currentCitySelect" size="large" @change="changeCityDate" class="city-radio">
        <template v-for="(item, index) in branchList" :key="index">
          <el-radio-button :label="item.branchName" :value="item.id" />
        </template>
      </el-radio-group>
      <div class="sale-content">
        <div class="item" v-for="(item, index) in saleData" :key="index" @click="switchChart(item, index)">
          <table>
            <tr class="top">
              {{
                item.title
              }}
            </tr>
            <tr class="bottom">
              {{
                item.value
              }}
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { getAllBranch } from "@/api/modules/set";
import { todaySales } from "@/api/modules/order";
import { Data } from "@/api/interface/index";

const emit = defineEmits(["change-id"]);
const echartsRef = ref<HTMLElement>();
// 时间范围选择
const currentTimeSelect = ref<string>("本日");

// const xData = ["张三", "张三", "张三", "张三", "张三", "张三"];
// const yData = [20, 30, 40, 50, 60, 70];
const xData: Ref = ref([]);
const yData: Ref = ref([]);
interface SelectSale {
  title: string;
  value?: string;
}
const saleData: Ref = ref([]);
const selectSale: Ref = ref({});
const selectIndex: Ref = ref(0);
const chatData: Ref = ref({});
let charTitle = ref("本日销售总额");

const getTodaySales = async (branchId: number, date: number, selectSale?: SelectSale) => {
  const {
    data: { salesTotalMoney, salesTotalNumber, markupPercentage, platformNumber, chat }
  } = await todaySales(branchId, date);
  saleData.value = [
    {
      title: `${currentTimeSelect.value}销售总额`,
      value: `￥${salesTotalMoney}`
    },
    {
      title: `${currentTimeSelect.value}订单总量`,
      value: `${salesTotalNumber || 0}`
    },
    {
      title: `${currentTimeSelect.value}商品加价率`,
      value: markupPercentage
    },
    {
      title: "出售渠道个数",
      value: platformNumber
    }
  ];
  chatData.value = chat;
  if (selectSale) {
    charTitle.value = selectSale.title;
  } else {
    charTitle.value = saleData.value[selectIndex.value].title;
  }
  chatSwitch(selectIndex.value);
  initEcharts(xData.value, yData.value, legendName.value);
};

const tabDateList = ref(["本日", "本周", "本月"]);

// 门店数据获取
type BranchObj = { branchName: string; id: number };
const branchList = ref<BranchObj[]>([]);
const currentCitySelect = ref("");
const getAllBranchData = async () => {
  const { data } = await getAllBranch({});
  branchList.value = data?.map(item => {
    return {
      branchName: item.branchName,
      id: item.id
    };
  });
  currentCitySelect.value = branchList.value[0].branchName;
  let selectObj = branchList.value.find(item => item.branchName === currentCitySelect.value);
  let id = selectObj?.id;
  const obj: Data.DateRange = { 本日: 0, 本周: 1, 本月: 2 };
  const date = obj[currentTimeSelect.value];
  if (typeof id === "number") {
    getTodaySales(id, date);
    emit("change-id", id);
  }
};
getAllBranchData();

// 门店切换
async function changeCityDate(e: any) {
  currentCitySelect.value = e;
  const selectObj = branchList.value.find(item => item.branchName === e);
  const id = selectObj!.id;
  const obj: Data.DateRange = { 本日: 0, 本周: 1, 本月: 2 };
  let date = obj[currentTimeSelect.value];
  getTodaySales(id, date);
  emit("change-id", id);
}

// 日期范围切换
function changeSelectDate(e: any) {
  currentTimeSelect.value = e;
}

function initEcharts(xData: any[], yData: any[], legendName: string) {
  let myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
  let option: echarts.EChartsOption = {
    title: {
      text: charTitle.value,
      top: 10,
      textStyle: {
        fontWeight: 500,
        fontSize: 14
      }
    },
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
      data: [legendName],
      textStyle: {
        color: "#a1a1a1"
      },
      bottom: "1%"
    },
    grid: {
      left: "2%",
      right: "8px",
      bottom: "13%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: xData,
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
        name: legendName,
        type: "bar",
        emphasis: {
          focus: "series"
        },
        data: yData
      }
    ]
  };
  useEcharts(myChart, option);
  const chartObserver = new ResizeObserver(() => {
    myChart.resize();
  });
  chartObserver.observe(echartsRef.value as HTMLElement);
}

function switchChart(item: SelectSale, index: number) {
  selectSale.value = item;
  selectIndex.value = index;
}

function chatSwitch(value: number) {
  if (value === 0) {
    xData.value = chatData.value.salesTotalMoney.map((item: any) => item.name);
    yData.value = chatData.value.salesTotalMoney.map((item: any) => item.value);
  }
  if (value === 1) {
    xData.value = chatData.value.salesTotalNumber.map((item: any) => item.name);
    yData.value = chatData.value.salesTotalNumber.map((item: any) => item.value);
  }
  if (value === 2) {
    xData.value = chatData.value.markupPercentage.map((item: any) => item.name);
    yData.value = chatData.value.markupPercentage.map((item: any) => item.value);
  }
  if (value === 3) {
    xData.value = chatData.value.platformNumber.map((item: any) => item.name);
    yData.value = chatData.value.platformNumber.map((item: any) => item.value);
  }
}

let id = computed(() => {
  const selectObj = branchList.value.find(item => item.branchName === currentCitySelect.value);
  return selectObj?.id;
});

let date = computed(() => {
  const obj: Data.DateRange = { 本日: 0, 本周: 1, 本月: 2 };
  return obj[currentTimeSelect.value];
});

let legendName = computed(() => {
  if ([`${currentTimeSelect.value}销售总额`, `${currentTimeSelect.value}商品加价率`].includes(selectSale.value.title)) {
    return "销售";
  } else if ([`${currentTimeSelect.value}订单总量`].includes(selectSale.value.title)) {
    return "订单";
  } else if (["出售渠道个数"].includes(selectSale.value.title)) {
    return "渠道";
  } else {
    return "";
  }
});

watch(
  () => currentTimeSelect.value,
  () => {
    if (typeof id.value === "number") {
      getTodaySales(id.value, date.value);
    }
  }
);

watch(
  () => selectSale.value,
  () => {
    if (typeof id.value === "number" && typeof date.value === "number") {
      chatSwitch(selectIndex.value);
      getTodaySales(id.value, date.value, selectSale.value);
    }
  }
);

onMounted(() => {
  switchChart({ title: `${currentTimeSelect.value}销售总额` }, 0);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
