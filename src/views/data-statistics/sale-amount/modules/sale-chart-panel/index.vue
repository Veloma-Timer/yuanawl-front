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
      <!--选择门店-->
      <el-radio-group v-model="branchId" size="large" @change="changeBranch" class="city-radio">
        <el-radio-button v-for="item in branchList" :key="item.id" :label="item.id">{{ item.branchName }}</el-radio-button>
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
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { getAllBranch } from "@/api/modules/set";
import { todaySales } from "@/api/modules/order";
import { shortcuts, parseTime } from "@/utils";

const emit = defineEmits(["change-id"]);
const echartsRef = ref<HTMLElement>();
const dateRange = ref<[string, string]>([parseTime(new Date(), "{y}-{m}-{d}"), parseTime(new Date(), "{y}-{m}-{d}")]);

const changeDaterange = (date: [string, string]) => (dateRange.value = date);

const xData = ref<(string | number)[]>([]);
const yData = ref<(string | number)[]>([]);
interface SelectSale {
  title?: string;
  value?: string | number;
}
const saleData = ref<SelectSale[]>([]);

const title = ref("销售总额");

const selectIndex = ref(0);
const chatData = ref<{
  salesTotalMoney: any[];
  salesTotalNumber: any[];
  markupPercentage: any[];
  platformNumber: any[];
}>({ salesTotalMoney: [], salesTotalNumber: [], markupPercentage: [], platformNumber: [] });

const getTodaySales = async () => {
  const {
    data: { salesTotalMoney, salesTotalNumber, markupPercentage, platformNumber, chat }
  } = await todaySales(branchId.value!, dateRange.value);
  saleData.value = [
    {
      title: `销售总额`,
      value: `￥${salesTotalMoney}`
    },
    {
      title: `订单总量`,
      value: `${salesTotalNumber || 0}`
    },
    {
      title: `商品加价率`,
      value: markupPercentage + "%"
    },
    {
      title: "出售渠道个数",
      value: platformNumber
    }
  ];
  chatData.value = chat;
  chatSwitch(selectIndex.value);
  initEcharts(xData.value, yData.value, legendName.value);
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
const changeBranch = (id: any) => {
  branchId.value = id;
  getTodaySales();
  emit("change-id", id);
};

const initEcharts = (xData: any[], yData: any[], legendName: string) => {
  let myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
  let option: echarts.EChartsOption = {
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
        tooltip: {
          valueFormatter: (value: any) => {
            if (title.value?.indexOf("商品加价率") > -1) {
              return value + "%";
            } else {
              return value;
            }
          }
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
};

const switchChart = (item: SelectSale, index: number) => {
  title.value = item.title!;
  selectIndex.value = index;
};

const chatSwitch = (value: number) => {
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
};

const legendName = computed(() => {
  if (["销售总额"].includes(title.value)) {
    return "金额";
  } else if (["订单总量"].includes(title.value)) {
    return "数量";
  } else if (["出售渠道个数"].includes(title.value)) {
    return "数量";
  } else if (["商品加价率"].includes(title.value)) {
    return "加价率";
  } else {
    return "";
  }
});

watch(dateRange, () => getTodaySales());

watch(title, () => {
  chatSwitch(selectIndex.value);
  getTodaySales();
});

onMounted(() => {
  switchChart({ title: `销售总额` }, 0);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
