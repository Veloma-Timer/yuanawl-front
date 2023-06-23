<template>
  <div class="wrap">
    <div class="left">
      <div class="content">
        <template v-if="selectIndex === 2">
          <el-select v-model="value1" placeholder="请选择" class="type-input" @change="typeChange" size="large" filterable>
            <template v-for="item in typeList" :key="item.id">
              <el-option :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </template>
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
import { todayRecycle } from "@/api/modules/order";
import { Data } from "@/api/interface/index";
import { SeriesOption, YAXisComponentOption } from "echarts";
// import { getAllUser } from "@/api/modules/set";

type TypeObj = { name: string; id: number };
const typeList = ref<TypeObj[]>([]);
const value1 = ref(-1);

const getType = async () => {
  // const { data } = await getAllUser({});
  typeList.value = [
    {
      name: "全部",
      id: -1
    },
    {
      name: "王者",
      id: 1
    },
    {
      name: "精英",
      id: 2
    }
  ];
};
getType();

const emit = defineEmits(["change-id"]);
const echartsRef = ref<HTMLElement>();
// 时间范围选择
const currentTimeSelect = ref<string>("本日");

const xData: any = ref(["张三", "张三", "张三", "张三", "张三", "精英"]);
const yData: any = ref([20, 30, 40, 50, 60, 70]);
interface SelectSale {
  title: string;
  value?: string;
}
const saleData: Ref = ref([]);
const selectSale: Ref = ref({});
const selectIndex: Ref = ref(0);
let charTitle = ref("本日销售总额");

const getTodaySales = async (branchId: number, date: number, selectSale?: SelectSale) => {
  const {
    data: { recyclePrice, arpa, recycleOrders, buyNumber }
  } = await todayRecycle(branchId, date);
  saleData.value = [
    {
      title: `${currentTimeSelect.value}回收金额`,
      value: `￥${recyclePrice}`
    },
    {
      title: `${currentTimeSelect.value}回收订单总量`,
      value: `￥${arpa || 0}`
    },
    {
      title: `${currentTimeSelect.value}回收游戏品类`,
      value: recycleOrders
    },
    {
      title: "七日未售出数量",
      value: buyNumber
    }
  ];
  if (selectSale) {
    charTitle.value = selectSale.title;
  } else {
    charTitle.value = saleData.value[selectIndex.value].title;
  }
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

function initEcharts(xData: any[], yData: any[], legendName: string[]) {
  let seriesTemp;
  let colorTemp;
  let yTemp;
  if (legendName.length > 1) {
    colorTemp = ["#5470C6", "#FEB45E"];
    seriesTemp = [
      {
        name: legendName[0],
        type: "bar",
        emphasis: {
          focus: "series"
        },
        data: yData
      },
      {
        name: legendName[1],
        type: "line",
        emphasis: {
          focus: "series"
        },
        data: yData
      }
    ];
    yTemp = [
      {
        type: "value",
        min: 0,
        max: "dataMax",
        axisLabel: {
          color: "#a1a1a1"
        }
      },
      {
        type: "value",
        min: 0,
        max: "dataMax",
        axisLabel: {
          color: "#a1a1a1"
        }
      }
    ];
  } else {
    colorTemp = ["#5470C6"];
    seriesTemp = [
      {
        name: legendName[0],
        type: "bar",
        emphasis: {
          focus: "series"
        },
        data: yData
      }
    ];
    yTemp = [
      {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: {
          color: "#a1a1a1"
        }
      }
    ];
  }

  let myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
  let option: echarts.EChartsOption = {
    color: colorTemp,
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
      data: legendName,
      textStyle: {
        color: "#a1a1a1"
      },
      bottom: "1%"
    },
    grid: {
      left: "2%",
      right: "8px",
      bottom: "13%",
      top: "80",
      containLabel: true
    },
    xAxis: [
      {
        data: xData,
        axisLabel: {
          color: "#a1a1a1"
        }
      }
    ],
    yAxis: yTemp as YAXisComponentOption,
    series: seriesTemp as SeriesOption
  };
  myChart.clear();
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

let id = computed(() => {
  const selectObj = branchList.value.find(item => item.branchName === currentCitySelect.value);
  return selectObj?.id;
});

let date = computed(() => {
  const obj: Data.DateRange = { 本日: 0, 本周: 1, 本月: 2 };
  return obj[currentTimeSelect.value];
});

let legendName = computed(() => {
  if ([`${currentTimeSelect.value}回收金额`].includes(selectSale.value.title)) {
    return ["金额"];
  } else if (
    [`${currentTimeSelect.value}回收订单总量`, `${currentTimeSelect.value}回收游戏品类`].includes(selectSale.value.title)
  ) {
    return ["数量"];
  } else if (["七日未售出数量"].includes(selectSale.value.title)) {
    return ["数量", "金额"];
  } else {
    return [""];
  }
});

function typeChange() {
  // e: any id
  // console.log(1112, e);
  const xData = ref(["精英"]);
  const yData = ref([70]);
  initEcharts(xData.value, yData.value, legendName.value);
}

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
      getTodaySales(id.value, date.value, selectSale.value);
    }
  }
);

onMounted(() => {
  switchChart({ title: `${currentTimeSelect.value}回收金额` }, 0);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
