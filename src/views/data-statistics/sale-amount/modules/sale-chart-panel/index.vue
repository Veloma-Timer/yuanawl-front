<template>
  <div class="wrap">
    <div class="left">
      <div class="content">
        {{ currentTimeSelect }}
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
        <div class="item" v-for="(item, index) in saleData" :key="index" @click="switchChart(item)">
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
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { getAllBranch } from "@/api/modules/set";
import { todaySales } from "@/api/modules/order";
import { TIME_RANGE } from "@/public/option";

const emit = defineEmits(["change-id"]);
const echartsRef = ref<HTMLElement>();
// 时间范围选择
const currentTimeSelect = ref<string>("本日");
const legendName = ref(`${currentTimeSelect.value}销售总额`);

const saleData: any = ref([]);
const getTodaySales = async (branchId: number, date: number) => {
  const {
    data: { salesPrice, arpa, paidOrders, buyNumber }
  } = await todaySales(branchId, date);
  saleData.value = [
    {
      title: `${currentTimeSelect.value}销售总额`,
      value: `￥${salesPrice}`
    },
    {
      title: `${currentTimeSelect.value}订单总量`,
      value: `￥${arpa}`
    },
    {
      title: `${currentTimeSelect.value}商品加价率`,
      value: paidOrders
    },
    {
      title: "出售渠道个数",
      value: buyNumber
    }
  ];
  // initEcharts(xData, yData1, yData2);
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
  let id = selectObj!.id;
  const obj: any = {
    本日: 0,
    本周: 1,
    本月: 2
  };
  let date = obj[currentTimeSelect.value];
  getTodaySales(id, date);
  emit("change-id", id);
};
getAllBranchData();

// 门店切换
async function changeCityDate(e: any) {
  currentCitySelect.value = e as string;
  const selectObj = branchList.value.find(item => item.branchName === e);
  const id = selectObj!.id;
  const obj: any = {
    本日: 0,
    本周: 1,
    本月: 2
  };
  let date = obj[currentTimeSelect.value];
  getTodaySales(id, date);
  emit("change-id", id);
}

// 日期范围切换
function changeSelectDate(e: any) {
  console.log(111, e);
  currentTimeSelect.value = e;
}

let id = computed(() => {
  const selectObj = branchList.value.find(item => item.branchName === currentCitySelect.value);
  return selectObj!.id;
});

let date = computed(() => {
  const obj: any = {
    本日: 0,
    本周: 1,
    本月: 2
  };
  return obj[currentTimeSelect.value];
});

watch(
  () => currentTimeSelect.value,
  () => {
    getTodaySales(id.value, date.value);
  }
);

function initEcharts(xData: any, yData: any, legendName: string, title: string) {
  let myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
  let option: echarts.EChartsOption = {
    title: {
      text: title,
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
      left: "3%",
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

function switchChart(item: any) {
  console.log("item", { ...item });
  const xData = ["张三", "张三", "张三", "张三", "张三", "张三"];
  const yData = [20, 30, 40, 50, 60, 70];
  if ([`${currentTimeSelect.value}销售总额`, `${currentTimeSelect.value}商品加价率`].includes(item.title)) {
    legendName.value = "销售";
  } else if ([`${currentTimeSelect.value}订单总量`].includes(item.title)) {
    legendName.value = "订单";
  } else if (["出售渠道个数"].includes(item.title)) {
    legendName.value = "渠道";
  }
  initEcharts(xData, yData, legendName.value, item.title);
}
onMounted(() => {
  switchChart({ title: `${currentTimeSelect.value}销售总额` });
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
