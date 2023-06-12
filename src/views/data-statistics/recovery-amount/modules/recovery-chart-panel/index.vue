<template>
  <div class="wrap">
    <div class="left">
      <div class="content">
        <Header :title="`${currentTimeSelect}回收`" class="header"></Header>
        <el-radio-group v-model="currentTimeSelect" size="large" @change="changeSelectDate" class="date-radio">
          <template v-for="(item, index) in tabDateList" :key="index">
            <el-radio-button :label="item.title" />
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
        <div class="item" v-for="(item, index) in saleData" :key="index">
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
import Header from "@/components/Header/index.vue";
import { ref } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { getAllBranch } from "@/api/modules/set";
import { todayRecycle } from "@/api/modules/order";
const emit = defineEmits(["change-id"]);
const echartsRef = ref<HTMLElement>();

const saleData: any = ref([]);
const getTodayRecycle = async (branchId: number, date: number) => {
  const {
    data: {
      recycleNumber: { current, preCurrent },
      recyclePrice,
      arpa,
      recycleOrders,
      buyNumber
    }
  } = await todayRecycle(branchId, date);

  const toDayX = current.map((item: any) => {
    return item.name;
  });
  const toDayY = current.map((item: any) => {
    return item.value;
  });
  const yesterdayY = preCurrent.map((item: any) => {
    return item.value;
  });
  initEcharts(toDayX, toDayY, yesterdayY);
  saleData.value = [
    {
      title: "今日回收金额",
      value: recyclePrice
    },
    {
      title: "客单价",
      value: arpa
    },
    {
      title: "支付订单数",
      value: recycleOrders
    },
    {
      title: "回收用户数",
      value: buyNumber
    }
  ];
};

// 时间范围选择
const currentTimeSelect = ref<string>("本日");
const tabDateList = ref([
  {
    title: "本日"
  },
  {
    title: "本周"
  },
  {
    title: "本月"
  }
]);

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
  getTodayRecycle(id, date);
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
  getTodayRecycle(id, date);
  emit("change-id", id);
}

// 日期范围切换
function changeSelectDate(e: any) {
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
    getTodayRecycle(id.value, date.value);
  }
);

function initEcharts(toDayX: any, toDayY: any, yesterdayY: any) {
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
      data: ["今日", "昨日"],
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
        boundaryGap: false,
        data: toDayX,
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
        name: "今日",
        type: "line",
        // stack: "Total",
        lineStyle: {
          color: "#63ECFF"
        },
        areaStyle: {
          color: "#63ECFF"
        },
        emphasis: {
          focus: "series"
        },
        data: toDayY
      },
      {
        name: "昨日",
        type: "line",
        // stack: "Total",
        lineStyle: {
          color: "#2ED7FF"
        },
        areaStyle: {
          color: "#2ED7FF"
        },
        emphasis: {
          focus: "series"
        },
        data: yesterdayY
      }
    ]
  };
  useEcharts(myChart, option);
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
