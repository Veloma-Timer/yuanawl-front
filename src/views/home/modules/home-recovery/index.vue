<template>
  <div>
    <div class="home-crud">
      <div class="title mb-2 relative">{{ title }}</div>
      <div class="crud-list flex">
        <!--<div v-for="(item, index) in crudListMap" :key="item + index" class="crud-list-item flex">-->
        <!--  <div class="recovery-number" ref="recoveryRef"></div>-->
        <!--  <div class="crud-total">-->
        <!--    <div class="total-name">-->
        <!--      <span>{{ props.branchName }}{{ namesList[index] }}</span>-->
        <!--    </div>-->
        <!--  </div>-->
        <!--</div>-->
        <div v-for="(item, index) in crudListMap" :key="index" class="crud-list-item flex">
          <DigitBoard
            :title="namesList[index]"
            :value="item.current"
            :year-value="item.year"
            :chain-value="item.yesterday"
            :date="branchName"
          />
        </div>
      </div>
    </div>
    <div class="home-name">
      <div class="home-name-left">
        <homeGroup :list-arr="statisticsObj?.recycleRatio" class-name="maintain" title="账号回收占比" />
      </div>
      <div class="home-name-right">
        <nameRight title="平台回收额排名" :salas-ranking-arr="statisticsObj?.recycleRanking" :header="['名字', '金额', '数量']" />
      </div>
    </div>
    <div class="home-name">
      <div class="home-name-left">
        <nameRight
          title="回收问题账号"
          :salas-ranking-arr="statisticsObj?.recycleRankingByProblem"
          :header="['工单类型', '金额', '数量']"
        />
      </div>
    </div>
    <div class="home-name">
      <div class="home-name-left">
        <homeChat :list-arr="statisticsObj?.recycleGameType" class-name="maintain" title="游戏类型" />
      </div>
      <div class="home-name-right">
        <homeChat :list-arr="statisticsObj?.recycleService" class-name="maintain" title="区服" />
      </div>
    </div>
    <homeGroup :list-arr="statisticsObj?.recycleSetComparison" title="回收组数据对比" />
    <homeChain :list-arr="statisticsObj?.resRecycle" :branch-name="branchNames" title="回收组渠道对比">
      <div>
        <el-select v-model="channelId" class="m-2" clearable placeholder="查看数据" @change="setTypes">
          <el-option v-for="item in statisticsObj?.channelList" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </div>
    </homeChain>
  </div>
</template>
<script setup lang="ts">
import { CaretTop } from "@element-plus/icons-vue";
import { ref, reactive, nextTick, watch, defineEmits } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import homeGroup from "@/views/home/modules/home-group/index.vue";
import nameRight from "@/views/home/modules/nameRight/index.vue";
import { HomeSet } from "@/api/interface";
import HomeChat from "@/views/home/modules/home-recovery/homeChat.vue";
import homeChain from "@/views/home/modules/home-chain/index.vue";
import DigitBoard from "@/views/home/components/DigitBoard.vue";
// 2、定义发射给父组件的方法
const emits = defineEmits(["getReuseList"]);
const recoveryRef = ref<HTMLElement>();
let channelId = ref();
const namesList: string[] = ["回收金额", "回收数量", "回收均价", "出售数量", "出售金额", "未售数量", "未售金额"];
// 处理数据
const props = withDefaults(
  defineProps<{
    statisticsObj: HomeSet.IRecycleStatistics;
    branchName: string;
    branchNames: string;
    title: string;
  }>(),
  {
    branchName: "今日"
  }
);
// const setNumber = () => {
//   const indexList: number[] = [1, 3, 5];
//   nextTick(() => {
//     let recoveryNumber = document.getElementsByClassName("recovery-number");
//     for (let i = 0; i < crudListMap.length; i++) {
//       const valueName = indexList.includes(i) ? "" : "￥";
//       let option = {
//         title: {
//           text: `${valueName}${crudListMap[i]}`,
//           x: "center",
//           y: "center",
//           textStyle: {
//             fontWeight: "normal",
//             color: "#0580f2",
//             fontSize: "12"
//           }
//         },
//         color: ["rgba(176, 212, 251, 1)"],
//         series: [
//           {
//             name: "Line 1",
//             type: "pie",
//             clockwise: true,
//             radius: ["50%", "70%"],
//             label: {
//               show: false
//             },
//             labelLine: {
//               show: false
//             },
//             emphasis: {
//               scale: true // 使用emphasis.scale替代hoverAnimation
//             },
//             data: [
//               {
//                 value: 20,
//                 itemStyle: {
//                   color: {
//                     // 完成的圆环的颜色
//                     colorStops: [
//                       {
//                         offset: 0,
//                         color: "#00cefc" // 0% 处的颜色
//                       },
//                       {
//                         offset: 1,
//                         color: "#367bec" // 100% 处的颜色
//                       }
//                     ]
//                   }
//                 },
//                 label: {
//                   show: false
//                 },
//                 labelLine: {
//                   show: false
//                 }
//               },
//               {
//                 value: 20
//               }
//             ]
//           }
//         ]
//       };
//       let myChart: echarts.ECharts = echarts.init(recoveryNumber[i] as HTMLElement);
//       useEcharts(myChart, option);
//     }
//   });
// };
// 处理数据
let crudListMap = reactive<
  {
    current: number | string;
    yesterday: number | string;
    year: number | string;
  }[]
>([]);
const setTypes = id => {
  emits("getReuseList", id);
};
const setCrud = obj => {
  crudListMap = [
    {
      current: obj.recycleMoney,
      yesterday: obj.ayerRecycleMoney,
      year: obj.yoyRecycleMoney
    },

    {
      current: obj.recycleAmount,
      yesterday: obj.ayerRecycleAmount,
      year: obj.yoyRecycleAmount
    },

    {
      current: obj.recycleAveMoney,
      yesterday: obj.ayerRecycleAveMoney,
      year: obj.yoyRecycleAveMoney
    },

    {
      current: obj.salesAmount,
      yesterday: obj.ayerSalesAmount,
      year: obj.yoySalesAmount
    },

    {
      current: obj.salesMoney,
      yesterday: obj.ayerSalesMoney,
      year: obj.yoySalesMoney
    },

    {
      current: obj.unsoldAmount,
      yesterday: obj.ayerUnsoldAmount,
      year: obj.yoyUnsoldAmount
    },

    {
      current: obj.unsoldMoney,
      yesterday: obj.ayerUnsoldMoney,
      year: obj.yoyUnsoldMoney
    }
  ];
  channelId.value = obj?.channelId;
  // setNumber();
};
watch(
  () => props.statisticsObj,
  count => {
    crudListMap = [];
    /* ... */
    setCrud(count);
  },
  { deep: true, immediate: true }
);
</script>
<style scoped lang="scss">
.home-crud {
  width: 100%;

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #475669;
    padding: 0 16px;

    &:after {
      content: "";
      position: absolute;
      left: 0;
      width: 4px;
      height: 100%;
      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;
      background-color: var(--el-color-primary);
    }
  }

  .crud-list {
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;

    .crud-list-item {
      width: 32.5%;
      max-height: 180px;
      margin-bottom: 10px;

      .recovery-number {
        width: 160px;
        height: 100%;
      }

      .crud-total {
        width: calc(100% - 160px);
        height: 100%;
        padding: 20px 0;
        color: #858585;

        .total-name {
          margin-bottom: 22px;
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
      border-radius: 6px;
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
    border-radius: 6px;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
  }
}
.home-name {
  display: flex;
  justify-content: space-between;
  margin: 32px 0;
  .home-name-left {
    width: 49%;
    height: 465px;
  }
  .home-name-right {
    width: 49%;
    height: 465px;
  }
}
//@media (width <= 1366px) {
//  /* 在此处添加你的样式 */
//  .crud-list-item {
//    width: calc((100% - 40px) / 3) !important;
//
//    &:nth-child(3n) {
//      margin: 0 !important;
//    }
//
//    &:nth-child(4n) {
//      margin: 0 20px 20px 0 !important;
//    }
//  }
//}
</style>
