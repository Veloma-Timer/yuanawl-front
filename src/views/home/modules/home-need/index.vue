<template>
  <div>
    <div class="home-crud">
      <div class="title">{{ props.title }}</div>
      <div class="crud-list">
        <homeNameList :await-work-order="awaitWorkOrder" />
      </div>
    </div>
    <homeNeed :list-arr="publishUnitTypesObj?.typeList" title="售后工单类型">
      <div>
        <span>星级</span>
        <el-select v-model="publishUnitTypesObj.typeId" class="m-2" clearable placeholder="查看数据" @change="setTypes">
          <el-option v-for="item in workOrderObj?.workOrderTypes" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
    </homeNeed>
    <homeNeed :list-arr="afterPublishUnitObj?.afterList" title="售后组数据对比">
      <span>问题类型</span>
      <el-select v-model="afterPublishUnitObj.afterId" class="m-2" clearable placeholder="查看数据" @change="setAfter">
        <el-option v-for="item in workOrderObj?.afterSalesSetComparison" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </homeNeed>
    <Chan :list-arr="workOrderObj?.afterSales" :branch-name="branchNames" title="售后组数据对比" />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import Chan from "@/views/home/modules/home-need/chan.vue";
import homeNameList from "@/views/home/modules/home-nameList/index.vue";
import homeNeed from "@/views/home/modules/home-group/need.vue";
import { HomeSet } from "@/api/interface";
// 处理数据
const props = withDefaults(
  defineProps<{
    workOrderObj: HomeSet.IAfterSalesStatistics;
    branchName: string;
    branchNames: string;
    title: string;
  }>(),
  {
    branchName: "今日",
    branchNames: "今日"
  }
);

let publishUnitTypesObj = ref({
  typeList: [],
  typeId: ""
});
let afterPublishUnitObj = ref({
  afterList: [],
  afterId: ""
});
const setTypes = (status: string) => {
  const publishSetComparison = props.workOrderObj.workOrderTypes;
  const values = publishSetComparison.find(item => item.id === status);
  const obj = {
    ...publishUnitTypesObj.value,
    typeList: values.data,
    typeId: values.id
  };
  return (publishUnitTypesObj.value = obj);
};
const setAfter = (status: string) => {
  const publishSetComparison = props.workOrderObj.afterSalesSetComparison;
  const values = publishSetComparison.find(item => item.id === status);
  const obj = {
    ...afterPublishUnitObj.value,
    afterList: values.data,
    afterId: values.id
  };
  return (afterPublishUnitObj.value = obj);
};
let awaitWorkOrder = ref({});
const setCrud = obj => {
  awaitWorkOrder.value = obj.awaitWorkOrder;
  if (obj.workOrderTypes.length > 0) {
    publishUnitTypesObj.value = {
      ...publishUnitTypesObj.value,
      typeList: obj.workOrderTypes[0].data,
      typeId: obj.workOrderTypes[0].id
    };
  }
  if (obj.afterSalesSetComparison.length > 0) {
    afterPublishUnitObj.value = {
      ...afterPublishUnitObj.value,
      afterList: obj.afterSalesSetComparison[0].data,
      afterId: obj.afterSalesSetComparison[0].id
    };
  }
};

watch(
  () => props.workOrderObj,
  count => {
    /* ... */
    setCrud(count);
  },
  { deep: true, immediate: true }
);
</script>
<style scoped lang="scss">
.home-crud {
  width: 100%;
  padding: 20px;
  background: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 6px;

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
      width: 33.33%;
      height: 181px;
      padding: 18px 22px;
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
