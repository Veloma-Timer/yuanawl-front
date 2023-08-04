<template>
  <div>
    <div class="home-crud">
      <div class="title mb-2 relative">{{ props.title }}</div>
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
        <homeGroup :list-arr="publishObj?.publishRatio" class-name="maintain" title="账号发布占比" />
      </div>
      <div class="home-name-right">
        <nameRight title="平台发布数量排名" :salas-ranking-arr="publishObj?.publishRanking" :header="['用户', '金额', '数量']" />
      </div>
    </div>
    <homeGroup :list-arr="publishUnit" title="发布组数据对比">
      <div class="release-button-list">
        <el-select v-model="publishId" placeholder="查看" filterable @change="setValue">
          <el-option v-for="item in publishObj.publishSetComparison" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
    </homeGroup>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import homeGroup from "@/views/home/modules/home-group/index.vue";
import nameRight from "@/views/home/modules/nameRight/index.vue";
import { HomeSet } from "@/api/interface";
import DigitBoard from "@/views/home/components/DigitBoard.vue";
import { IDigitBoard } from "@/typings";

const namesList: string[] = ["已发布金额", "已发布数量", "已发布均价"];
const publishId = ref();
// 处理数据
const props = withDefaults(
  defineProps<{
    publishObj: HomeSet.IPublishStatistics;
    branchName: string;
    title: string;
  }>(),
  {
    branchName: "今日"
  }
);
const crudListMap = ref<IDigitBoard[]>([]);
let publishUnit = ref([]);
const setCrud = (obj: HomeSet.IPublishStatistics) => {
  crudListMap.value = [
    {
      current: obj.publishMoney,
      yesterday: obj.ayerPublishMoney,
      year: obj.yoyPublishMoney
    },
    {
      current: obj.publishAmount,
      yesterday: obj.ayerPublishAmount,
      year: obj.yoyPublishAmount
    },
    {
      current: obj.publishAveMoney,
      yesterday: obj.ayerPublishAveMoney,
      year: obj.yoyPublishAveMoney
    }
  ];
  publishUnit.value = obj.publishRatio;
  // setNumber();
};
const setValue = (status: number) => {
  const publishSetComparison = props.publishObj.publishSetComparison;
  const values = publishSetComparison.find(item => item.id === status);
  return (publishUnit.value = values.data);
};
watch(
  () => props.publishObj,
  count => {
    crudListMap.value = [];
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
    width: 100%;

    .crud-list-item {
      min-width: 24%;
      margin-right: 10px;
      max-height: 180px;
      margin-bottom: 10px;

      .release-number {
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
.release-button-list {
  span {
    display: inline-block;
    width: 62px;
    height: 30px;
    line-height: 28px;
    border: 2px solid #dc463a;
    font-size: 12px;
    font-weight: normal;
    text-align: CENTER;
    color: white;
    background: linear-gradient(180deg, #dc463a, #dc463a);
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
