<template>
  <div class="wrap">
    <div class="left">
      <div class="content">
        <div class="flex flex-row justify-between items-center bg-slate-100 rounded-xl p-2">
          <h6 class="text-sm">{{ title }}</h6>
          <div>
            <el-date-picker
              v-model="dateRange"
              unlink-panels
              type="daterange"
              format="YYYY-MM-DD"
              range-separator="To"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              start-placeholder="开始时间"
              :shortcuts="shortcuts"
              @change="changeDaterange"
            />
          </div>
        </div>
        <div ref="echartsRef" class="sale-echarts"></div>
      </div>
    </div>
    <div class="right">
      <el-radio-group v-model="branchId" size="large" @change="changeBranch" class="city-radio">
        <el-radio-button v-for="item in branchList" :key="item.id" :label="item.id">{{ item.branchName }}</el-radio-button>
        >
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
import { todayRecycles } from "@/api/modules/order";
import { SeriesOption, YAXisComponentOption } from "echarts";
import { getAllList } from "@/api/modules/accountClass";
import { parseTime, shortcuts } from "@/utils";

const selectTypeId: Ref = ref();

const dateRange = ref<[string, string]>([parseTime(new Date(), "{y}-{m}-{d}"), parseTime(new Date(), "{y}-{m}-{d}")]);

const changeDaterange = (date: [string, string]) => (dateRange.value = date);

const allTypeList: Ref = ref([]);
const setAllTypeList = async () => {
  const { data } = await getAllList();
  allTypeList.value = data;
};
setAllTypeList();

const emit = defineEmits(["change-id"]);
const echartsRef = ref<HTMLElement>();

const xData: Ref = ref([]);
const yData: Ref = ref([]);
const yData2: Ref = ref([]); // 七日未售 有y轴有两个值 数量和金额 这里用做金额
interface SelectSale {
  title: string;
  value?: string;
}
const saleData: Ref = ref([]);
const title = ref("回收金额");
const selectIndex: Ref = ref(0);
const chatData: Ref = ref({});
// let charTitle = ref("本日销售总额");

const getTodaySales = async () => {
  const postData = selectTypeId.value
    ? { branchId: branchId.value, date: dateRange.value, id: selectTypeId.value }
    : { branchId: branchId.value, date: dateRange.value };
  const {
    data: { recycleTotalMoney, recycleTotalNumber, gameCategory, sevenDaysTotalNumber, chat }
  } = await todayRecycles(postData);
  saleData.value = [
    {
      title: `回收金额`,
      value: `￥${recycleTotalMoney}`
    },
    {
      title: `回收订单总量`,
      value: `${recycleTotalNumber || 0}`
    },
    {
      title: `回收游戏品类`,
      value: gameCategory
    },
    {
      title: "七日未售出数量",
      value: sevenDaysTotalNumber
    }
  ];
  chatData.value = chat;
  chatSwitch(selectIndex.value);
  initEcharts(xData.value, yData.value, yData2.value, legendName.value);
};

// 门店数据获取
type BranchObj = { branchName: string; id: number };
const branchList = ref<BranchObj[]>([]);
const branchId = ref<number>();
const getAllBranchData = async () => {
  const { data } = await getAllBranch();
  branchList.value = data?.map(item => {
    return {
      branchName: item.branchName,
      id: item.id
    };
  });
  branchId.value = branchList.value[0].id;
  await getTodaySales();
  emit("change-id", branchId.value);
};
getAllBranchData();

// 门店切换
const changeBranch = async (id: any) => {
  branchId.value = id;
  await getTodaySales();
  emit("change-id", id);
};

const initEcharts = (xData: any[], yData: any[], yData2: any[], legendName: string[]) => {
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
        data: yData2
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
};

const switchChart = (item: SelectSale, index: number) => {
  title.value = item.title!;
  selectIndex.value = index;
};

const chatSwitch = (value: number) => {
  if (value === 0) {
    xData.value = chatData.value.recycleTotalMoney.map((item: any) => item.name);
    yData.value = chatData.value.recycleTotalMoney.map((item: any) => item.value);
  }
  if (value === 1) {
    xData.value = chatData.value.recycleTotalNumber.map((item: any) => item.name);
    yData.value = chatData.value.recycleTotalNumber.map((item: any) => item.value);
  }
  if (value === 2) {
    xData.value = chatData.value.gameCategory.map((item: any) => item.name);
    yData.value = chatData.value.gameCategory.map((item: any) => item.value);
  }
  if (value === 3) {
    xData.value = chatData.value.sevenDaysTotalNumber.map((item: any) => item.name);
    yData.value = chatData.value.sevenDaysTotalNumber.map((item: any) => item.value);
    yData2.value = chatData.value.sevenDaysTotalNumber.map((item: any) => item.money);
  }
};

const legendName = computed(() => {
  if ([`回收金额`].includes(title.value)) {
    return ["金额"];
  } else if ([`回收订单总量`, `回收游戏品类`].includes(title.value)) {
    return ["数量"];
  } else if (["七日未售出数量"].includes(title.value)) {
    return ["数量", "金额"];
  } else {
    return [""];
  }
});

watch(dateRange, () => getTodaySales());

watch(selectTypeId, () => getTodaySales());

watch(title, () => {
  chatSwitch(selectIndex.value);
  getTodaySales();
});

onMounted(() => {
  switchChart({ title: `回收金额` }, 0);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
