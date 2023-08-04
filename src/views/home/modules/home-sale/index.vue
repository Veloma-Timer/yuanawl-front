<template>
  <div>
    <div class="title mb-2 relative">{{ title }}</div>
    <div class="home-crud">
      <div class="crud-list flex">
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
        <homeGroup :list-arr="salesObj?.salesRatio" class-name="maintain" title="账号销售占比" />
      </div>
      <div class="home-name-right">
        <nameRight title="金额榜" :salas-ranking-arr="salesObj?.salesRanking" :header="['姓名', '销售额', '销售数量']" />
      </div>
    </div>
    <div class="home-name">
      <div class="home-name-left">
        <nameRight title="数量榜" :salas-ranking-arr="salesObj?.salesRankingByAmount" :header="['姓名', '销售额', '销售数量']" />
      </div>
    </div>
    <homeGroup :list-arr="salesObj?.salesSetComparison" title="销售数据对比" />
    <homeChain :list-arr="salesObj?.resChannel" :branch-name="branchNames" title="销售渠道对比">
      <div>
        <el-select v-model="channelId" class="m-2" clearable placeholder="查看数据" @change="setTypes">
          <el-option v-for="item in salesObj?.channelList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </homeChain>
    <homeChain :list-arr="salesObj?.sales" :branch-name="branchNames" title="销售组对比" />
    <homeGroup :list-arr="salesObj?.salesChannelStatistics" title="渠道销售订单统计" />
  </div>
</template>
<script setup lang="ts">
import DigitBoard from "@/views/home/components/DigitBoard.vue";
import { ref, watch } from "vue";
import homeGroup from "@/views/home/modules/home-group/index.vue";
import nameRight from "@/views/home/modules/nameRight/index.vue";
import { HomeSet } from "@/api/interface";
import homeChain from "@/views/home/modules/home-chain/index.vue";
const namesList: string[] = ["销售金额", "销售数量", "销售加价率"];
// 2、定义发射给父组件的方法
const emits = defineEmits(["getSalesList"]);

// 处理数据
const props = withDefaults(
  defineProps<{
    salesObj: HomeSet.ISalesStatistics;
    branchName: string;
    branchNames: string;
    title: string;
  }>(),
  {
    branchName: "今日",
    branchNames: "今日"
  }
);
const setTypes = id => {
  emits("getSalesList", id);
};
// 处理数据
const crudListMap = ref<IDigitBoard[]>([]);
let channelId = ref();
// setNumber();
const setCrud = (obj: HomeSet.ISalesStatistics) => {
  crudListMap.value = [
    {
      current: obj.salesMoney,
      yesterday: obj.salesYesterdayMoney,
      year: obj.salesYearMoney
    },
    {
      current: obj.salesAmount,
      yesterday: obj.salesYesterdayAmount,
      year: obj.salesYearAmount
    },
    {
      current: obj.markupPercentage,
      yesterday: obj.markupPercentageYesterday,
      year: obj.markupPercentageYear // 同比加价率
    }
  ];
  channelId.value = obj?.channelId;
  // setNumber();
};
watch(
  () => props.salesObj,
  sales => {
    crudListMap.value = [];
    /* ... */
    setCrud(sales);
  },
  { deep: true, immediate: true }
);
</script>
<style scoped lang="scss">
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
.home-crud {
  width: 100%;

  .title {
    font-size: 24px;
    font-weight: normal;
    color: #343434;
  }

  .crud-list {
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;

    .crud-list-item {
      min-width: 32.5%;
      max-height: 180px;
      margin-bottom: 10px;

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
  margin: 15px 0;
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
