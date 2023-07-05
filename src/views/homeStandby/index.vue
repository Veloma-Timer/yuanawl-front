<template>
  <div class="home table-box">
    <div class="home-tab mb30 flex">
      <div class="tab-list flex ml34">
        <el-button-group>
          <el-button type="primary" v-for="item in monthList" :key="item.id" @click="setValue(true, item.id, item.branchName)">
            {{ item.branchName }}
          </el-button>
        </el-button-group>
      </div>
    </div>
    <homeSale v-if="salesObj" :sales-obj="salesObj" :branch-name="branchName" title="销售数据汇总" />
    <homeRecovery v-if="statisticsObj" :statistics-obj="statisticsObj" :branch-name="branchName" title="回收数据汇总" />
    <homeRelease v-if="publishObj" :publish-obj="publishObj" :branch-name="branchName" title="发布数据汇总" />
    <homeNeed v-if="workOrderObj" :work-order-obj="workOrderObj" :branch-name="branchName" title="待办工单" />
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted } from "vue";
import homeSale from "@/views/home/modules/home-sale/index.vue";
import homeRecovery from "@/views/home/modules/home-recovery/index.vue";
import homeRelease from "@/views/home/modules/home-release/index.vue";
import homeNeed from "@/views/home/modules/home-need/index.vue";
import { getUserProfile, IStatistics } from "@/api/modules/home";
import { HomeSet } from "@/api/interface";
import { useRoute } from "vue-router";
const route = useRoute();
interface Item {
  branchName: string;
  id: number | null;
}
const monthList: Item[] = [
  { branchName: "全部", id: null },
  { branchName: "今日", id: 0 },
  { branchName: "本周", id: 1 },
  { branchName: "本月", id: 2 }
];
const monthName = ref(0);
const branchName = ref("今日");
const params = ref<IStatistics>();
const setValue = function (bol: boolean, state: number, name: string) {
  branchName.value = name;
  params.value = {
    ...params.value,
    userId: state,
    date: monthName.value
  };
  setHomeCardList();
};
const salesObj = ref<HomeSet.ISalesStatistics>(); // 销售组
const statisticsObj = ref<HomeSet.IRecycleStatistics>(); // 回收组
const publishObj = ref<HomeSet.IPublishStatistics>(); // 回收组
const workOrderObj = ref<HomeSet.IAfterSalesStatistics>(); // 售后
// let behindObj = null; // 后面的数据
const setHomeCardList = async () => {
  const {
    data: { sales, recycle, publish, workOrder }
  } = (await getUserProfile(params.value!)) as any;
  salesObj.value = sales as any;
  statisticsObj.value = recycle as any;
  publishObj.value = publish as any;
  workOrderObj.value = workOrder as any;
};
// 获取门店
const branchAllList = async (id: number) => {
  params.value = {
    ...params.value,
    userId: id,
    date: monthName.value
  };
  await setHomeCardList();
};
// 获取首页统计
onMounted(() => {
  setTimeout(() => {
    // 携带参数page跳转
    const { id } = route.query;
    const userId: number = Number(id);
    branchAllList(userId);
  }, 300);
});
</script>

<style scoped lang="scss">
@import "@/views/home/index";
.group {
  margin-bottom: 0;
}
</style>
