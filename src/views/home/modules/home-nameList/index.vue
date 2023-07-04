<template>
  <div class="home-name">
    <div class="home-name-left">
      <div class="name-left-bottom">
        <div class="flex">
          <div class="left-progress mt30">
            <el-progress type="circle" :percentage="awaitWorkOrder?.untreatedAmount" :width="197">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}个</span>
                <span class="percentage-label">总未处理</span>
              </template>
            </el-progress>
          </div>
          <div class="left-progress mt30">
            <el-progress type="circle" :percentage="awaitWorkOrder?.finishedAmount" :width="197">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}个</span>
                <span class="percentage-label">今日完成</span>
              </template>
            </el-progress>
          </div>
          <div class="left-table">
            <div class="table-item flx-align-center" v-for="item in awaitWorkOrder?.pendingList" :key="item.id">
              <div class="operate">【待处理】</div>
              <div class="content">订单[{{ item.orderCode }}]</div>
              <div class="bottom" @click="setRouterLink(item)">立即处理&gt;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const getNameList = async () => {};
const setRouterLink = item => {
  router.push({
    path: "/afterSales/orderSummary",
    query: {
      orderCode: item.orderCode
    }
  });
};
// 处理数据
const props = defineProps({
  platformSalas: {
    type: Array,
    default: () => []
  },
  awaitWorkOrder: {
    type: Object,
    default: () => {
      return {
        untreatedAmount: 0,
        finishedAmount: 0,
        pendingList: []
      };
    }
  },
  salasRanking: {
    type: Array,
    default: () => []
  }
});
watch(
  () => props.awaitWorkOrder,
  count => {
    /* ... */
    props.awaitWorkOrder = count;
  },
  { deep: true, immediate: true }
);
getNameList();
</script>
<style scoped lang="scss">
.home-name {
  display: flex;
  flex-wrap: wrap;
  .home-name-left {
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    .name-left-bottom {
      width: 100%;
      //width: 780px;
      //height: 300px;
      padding: 20px 46px 32px 26px;
      .left-title {
        font-size: 18px;
        color: #333333;
      }
      .left-progress {
        //width: calc(100% - 465px);
        margin-right: 50px;
      }
      .left-table {
        width: calc(100% - 297px);
        .table-item {
          width: 412px;
          height: 41px;
          float: left;
          padding: 0 16px;
          margin-bottom: 7px;
          background: #ffffff;
          border: 2px solid #f0f0f0;
          border-radius: 21px;
          .operate {
            width: 80px;
            font-size: 16px;
            font-weight: normal;
            color: #f85d5d;
          }
          .content {
            flex: 1;
            font-size: 16px;
            color: #333333;
          }
          .bottom {
            width: 90px;
            height: 28px;
            font-size: 12px;
            font-weight: normal;
            line-height: 28px;
            color: #ffffff;
            text-align: center;
            cursor: pointer;
            background: #f85d5d;
            border-radius: 14px;
          }
          &:nth-child(1n) {
            margin: 6px 20px;
          }
        }
      }
    }
  }
}
@media (width <= 1366px) {
  .home-name-left {
    display: block !important; /* 在此处添加你的样式 */
    .name-left-top {
      width: 100% !important;
    }
    .name-left-bottom {
      width: 100% !important;
    }
  }
}
</style>
