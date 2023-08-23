<template>
  <div>
    <div class="home-crud">
      <div class="title mb-2 relative">{{ title }}</div>
      <div class="crud-list">
        <div v-for="(item, index) in crudListMap" :key="index" class="crud-list-item flex">
          <DigitBoard
            v-if="statisticsObj"
            :title="namesList[index]"
            :value="item.current"
            :year-value="item.year"
            :chain-value="item.yesterday"
            :date="branchName"
          />
          <DigitBoardSkeleton v-else />
        </div>
      </div>
    </div>
    <div class="home-name">
      <div class="home-name-left">
        <HomeGroup
          v-if="statisticsObj?.recycleRatio"
          :list-arr="statisticsObj?.recycleRatio"
          class-name="maintain"
          title="账号回收占比"
        />
        <HalfScreenSkeleton v-else />
      </div>
      <div class="home-name-right">
        <NameRight
          v-if="statisticsObj?.recycleRanking"
          title="平台回收数量排名"
          :salas-ranking-arr="statisticsObj?.recycleRanking"
          :header="['名字', '金额', '数量']"
        />
        <HalfScreenSkeleton v-else />
      </div>
    </div>
    <div class="home-name mt-[20px]">
      <div class="home-name-left">
        <HomeChat
          v-if="statisticsObj?.recycleGameType"
          :list-arr="statisticsObj?.recycleGameType"
          class-name="maintain"
          title="游戏类型"
        />
        <HalfScreenSkeleton v-else />
      </div>
      <div class="home-name-right">
        <HomeChat
          v-if="statisticsObj?.recycleService"
          :list-arr="statisticsObj?.recycleService"
          class-name="maintain"
          title="区服"
        />
        <HalfScreenSkeleton v-else />
      </div>
    </div>
    <div class="home-name">
      <div class="home-name-left mt-[20px]">
        <NameRight
          title="回收问题账号"
          :salas-ranking-arr="statisticsObj?.recycleRankingByProblem"
          :header="['工单类型', '金额', '数量']"
        />
      </div>
    </div>
    <HomeGroup :list-arr="statisticsObj?.recycleSetComparison" title="回收组数据对比" />
    <HomeChain :list-arr="statisticsObj?.resRecycle" :branch-name="branchNames" title="回收渠道对比">
      <div>
        <el-select v-model="channelId" class="m-2" clearable placeholder="查看数据" @change="setTypes">
          <el-option v-for="item in statisticsObj?.channelList" :key="item.id" :label="item.label" :value="item.id!" />
        </el-select>
      </div>
    </HomeChain>
  </div>
</template>
<script setup lang="ts">
import HomeGroup from "@/views/home/modules/home-group/index.vue";
import NameRight from "@/views/home/modules/nameRight/index.vue";
import { HomeSet } from "@/api/interface";
import HomeChat from "@/views/home/modules/home-recovery/homeChat.vue";
import HomeChain from "@/views/home/modules/home-chain/index.vue";
import DigitBoard from "@/views/home/components/DigitBoard.vue";
import type { IDigitBoard } from "@/typings";
import currency from "currency.js";
import DigitBoardSkeleton from "../../components/DigitBoardSkeleton.vue";
import HalfScreenSkeleton from "../../components/HalfScreenSkeleton.vue";

// 2、定义发射给父组件的方法
const emits = defineEmits(["getReuseList"]);
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
const crudListMap = ref<IDigitBoard[]>([]);
const setTypes = (id: any) => emits("getReuseList", id);
const setCrud = (obj: HomeSet.IRecycleStatistics) => {
  crudListMap.value = [
    {
      current: currency(obj?.recycleMoney).format({ symbol: "¥" }),
      yesterday: obj?.ayerRecycleMoney,
      year: obj?.yoyRecycleMoney
    },

    {
      current: obj.recycleAmount,
      yesterday: obj.ayerRecycleAmount,
      year: obj.yoyRecycleAmount
    },

    {
      current: currency(obj.recycleAveMoney).format({ symbol: "¥" }),
      yesterday: obj.ayerRecycleAveMoney,
      year: obj.yoyRecycleAveMoney
    },

    {
      current: obj.salesAmount,
      yesterday: obj.ayerSalesAmount,
      year: obj.yoySalesAmount
    },

    {
      current: currency(obj.salesMoney).format({ symbol: "¥" }),
      yesterday: obj.ayerSalesMoney,
      year: obj.yoySalesMoney
    },

    {
      current: obj.unsoldAmount,
      yesterday: obj.ayerUnsoldAmount,
      year: obj.yoyUnsoldAmount
    },

    {
      current: currency(obj.unsoldMoney).format({ symbol: "¥" }),
      yesterday: obj.ayerUnsoldMoney,
      year: obj.yoyUnsoldMoney
    }
  ];
  channelId.value = obj?.channelId;
};
watch(
  () => props.statisticsObj,
  data => {
    crudListMap.value = [];
    if (!data) return;
    setCrud(data);
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
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;

    .crud-list-item {
      min-width: 25%;
      max-height: 180px;
      margin-bottom: 20px;
      margin-right: 20px;

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
  .home-name-left {
    width: 48.8%;
    height: 465px;
    margin-right: 20px;
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
