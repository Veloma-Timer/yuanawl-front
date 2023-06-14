<template>
  <div class="home-crud">
    <div class="crud-list flex">
      <div v-for="(item, index) in crudListMap" :key="item.id" class="crud-list-item flex">
        <div class="crud-number" ref="crudNumberRef"></div>
        <div class="crud-total">
          <div class="total-name">
            <span v-show="index <= 7">{{ props.branchName }}</span>
            <span>{{ analysis[index].label }}</span>
          </div>
          <div v-if="analysis[index].yesterday" class="total-compare">昨日同比</div>
          <div class="total-proportion flex flx-align-center flx-justify-between">
            <div v-show="analysis[index].yesterday">
              {{ item.preValue }}
              <el-icon>
                <CaretTop />
              </el-icon>
            </div>
            <img src="@/assets/images/data.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="home-proportion">
      <div class="proportion-item" ref="proportionA"></div>
      <div class="proportion-item" ref="proportionB"></div>
    </div>
    <div class="proportion" ref="proportionC"></div>
  </div>
</template>
<script setup lang="ts">
import { CaretTop } from "@element-plus/icons-vue";
import { ref, reactive, defineProps, watch, nextTick } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { setValues } from "@/views/home/modules/homeUtis.js";
import { useRouter } from "vue-router";
const router = useRouter();
const crudNumberRef = ref<HTMLElement>();
const proportionA = ref<HTMLElement>();
const proportionB = ref<HTMLElement>();
const proportionC = ref<HTMLElement>();
const analysis = [
  { label: "销售总额", yesterday: true },
  { label: "销售数量", yesterday: true },
  { label: "回收数量", yesterday: true },
  { label: "销售均价", yesterday: true },
  { label: "回收均价", yesterday: true },
  { label: "回收总额", yesterday: true },
  { label: "总销售量", yesterday: false },
  { label: "平台总回收量", yesterday: false },
  { label: "平台日均新增销售", yesterday: false },
  { label: "平台日均新增回收", yesterday: false }
];
const saleGet = salesPriceMap => {
  let myChart: echarts.ECharts = echarts.init(proportionA.value as HTMLElement);
  let option: echarts.EChartsOption = {
    title: {
      text: "今日销售账号占比",
      left: "left"
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      bottom: 0
    },
    series: [
      {
        type: "pie",
        radius: "70%",
        data: salesPriceMap,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        },
        label: {
          formatter: function (params) {
            return `${params.name}-${params.value}`;
          }
        }
      }
    ]
  };
  useEcharts(myChart, option);
  const chartObserver = new ResizeObserver(() => {
    myChart.resize();
  });
  chartObserver.observe(proportionA.value as HTMLElement);
  myChart.on("click", function (param) {
    console.log(param.data);
    routerLink(param.data);
  });
};
// 跳转方法
const routerLink = item => {
  router.push({
    path: "/commodity/summary",
    query: {
      accountType: item.number
    }
  });
};
// 回收占比
const recoveryGet = recyclingPriceMap => {
  let myChart: echarts.ECharts = echarts.init(proportionB.value as HTMLElement);
  let option: echarts.EChartsOption = {
    title: {
      text: "今日回收账号占比",
      left: "left"
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      bottom: 0
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data: recyclingPriceMap,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        },
        label: {
          formatter: function (params) {
            return `${params.name}-${params.value}`;
          }
        }
      }
    ]
  };
  useEcharts(myChart, option);
  const chartObserver = new ResizeObserver(() => {
    myChart.resize();
  });
  chartObserver.observe(proportionB.value as HTMLElement);
  myChart.on("click", function (param) {
    routerLink(param.data);
  });
};
// 工单占比
const orderGet = (saleAccountNumber, workOrderNumber, data) => {
  let myChart: echarts.ECharts = echarts.init(proportionC.value as HTMLElement);
  let option: echarts.EChartsOption = {
    title: { text: "工单占比" },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ["已售账号数量总数", "工单数量"],
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
        data: data
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: "{value}"
        }
      }
    ],
    series: [
      {
        name: "已售账号数量总数",
        type: "bar",
        data: saleAccountNumber
      },
      {
        name: "工单数量",
        type: "bar",
        data: workOrderNumber
      }
    ]
  };
  useEcharts(myChart, option);
  const chartObserver = new ResizeObserver(() => {
    myChart.resize();
  });
  chartObserver.observe(proportionC.value as HTMLElement);
};
// 处理数据
const wholeSetMap = obj => {
  let data,
    saleNumber,
    worNumber = [];
  const { saleAccountNumber, workOrderNumber } = obj.workOrderProp;
  const salesPriceMap = obj.salesPriceMap;
  const recyclingPriceMap = obj.recyclingPriceMap;
  data = setValues(saleAccountNumber, "name");
  saleNumber = setValues(saleAccountNumber, "value");
  worNumber = setValues(workOrderNumber, "value");
  saleGet(salesPriceMap);
  recoveryGet(recyclingPriceMap);
  orderGet(saleNumber, worNumber, data);
};
const props = defineProps({
  crudListObj: {
    type: Object,
    default: () => {}
  },
  branchName: {
    type: String,
    default: "今日"
  }
});
const setNumber = () => {
  nextTick(() => {
    let crudNumber = document.getElementsByClassName("crud-number");
    for (let i = 0; i < crudListMap.length; i++) {
      let option: echarts.EChartsOption = {
        title: {
          text: `${crudListMap[i].value}`,
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            color: "#0580f2",
            fontSize: "12"
          }
        },
        color: ["rgba(176, 212, 251, 1)"],
        series: [
          {
            name: "Line 1",
            type: "pie",
            clockwise: true,
            radius: ["50%", "70%"],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            emphasis: {
              scale: true // 使用emphasis.scale替代hoverAnimation
            },
            data: [
              {
                value: crudListMap[i].value,
                itemStyle: {
                  color: {
                    // 完成的圆环的颜色
                    colorStops: [
                      {
                        offset: 0,
                        color: "#00cefc" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#367bec" // 100% 处的颜色
                      }
                    ]
                  },
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              },
              {
                value: 20
              }
            ]
          }
        ]
      };
      let myChart: echarts.ECharts = echarts.init(crudNumber[i] as HTMLElement);
      useEcharts(myChart, option);
    }
  });
};
// 处理数据
let crudListMap = reactive([]);
const setCrud = obj => {
  crudListMap = [
    obj.totalSales,
    obj.salesQuantity,
    obj.recyclingQuantity,
    obj.averageSellingPrice,
    obj.recoveryAveragePrice,
    obj.totalRecovery,
    obj.totalSalesVolume,
    obj.overallRecovery,
    obj.averageDailyNewSales,
    obj.dailyAverageNewRecyclingVolume
  ];
  setNumber();
};
watch(
  () => props.crudListObj,
  count => {
    /* ... */
    setCrud(count);
    wholeSetMap(count);
  }
);
watch(
  () => props.branchName,
  value => {
    console.log(`车变了`, value);
  }
);
</script>
<style scoped lang="scss">
.home-crud {
  width: 100%;
  .crud-list {
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    .crud-list-item {
      width: 32.5%;
      height: 181px;
      padding: 18px 22px;
      margin-bottom: 10px;
      background: #ffffff;
      border: 2px solid #f0f0f0;
      border-radius: 25px;
      .crud-number {
        width: 160px;
        height: 100%;
      }
      .crud-total {
        width: calc(100% - 160px);
        height: 100%;
        padding: 20px 0;
        color: #858585;
        .total-name {
          margin-bottom: 13px;
          font-size: 16px;
          font-weight: normal;
        }
        .total-compare {
          font-size: 8px;
          font-weight: normal;
        }
        .total-proportion {
          position: relative;
          font-size: 12px;
          font-weight: normal;
          color: #1cd1a1;
          img {
            position: absolute;
            right: 0;
            width: 75px;
            height: 31px;
          }
        }
      }
      &:nth-child(4n) {
        margin: 0;
      }
    }
  }
  .home-proportion {
    display: flex;
    margin: 0 0 40px;
    .proportion-item {
      width: calc((100% - 40px) / 2);
      height: 455px;
      padding: 10px 20px;
      margin: 0 40px 0 0;
      background: #ffffff;
      border-radius: 25px;
      box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
      &:last-child {
        margin: 0;
      }
    }
  }
  .proportion {
    width: 100%;
    height: 455px;
    padding: 10px 20px;
    margin-bottom: 40px;
    background: #ffffff;
    border-radius: 25px;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
  }
}

@media (width <= 1366px) {
  /* 在此处添加你的样式 */
  .crud-list-item {
    width: calc((100% - 40px) / 3) !important;
    &:nth-child(3n) {
      margin: 0 !important;
    }
    &:nth-child(4n) {
      margin: 0 20px 20px 0 !important;
    }
  }
}
</style>
