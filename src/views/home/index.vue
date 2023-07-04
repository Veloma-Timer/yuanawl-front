<template>
  <div class="home table-box">
    <div class="home-tab mb30 flex">
      <div class="tab-list flex clear">
        <el-button-group v-show="userRoleId === 1">
          <el-button type="primary" v-for="item in cityList" :key="item.id" @click="setValue(true, item.id, branchName)">
            {{ item.branchName }}
          </el-button>
        </el-button-group>
      </div>
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
import { getAllBranch } from "@/api/modules/set";
import { getHomeStatistics, IStatistics } from "@/api/modules/home";
import { userObj } from "@/views/home/modules/homeUtis";
import { HomeSet } from "@/api/interface";
interface Item {
  branchName: string;
  id: number | null;
}
const cityList = ref([{ branchName: "全部", id: 0 }]);
const monthList: Item[] = [
  { branchName: "全部", id: null },
  { branchName: "今日", id: 0 },
  { branchName: "本周", id: 1 },
  { branchName: "本月", id: 2 }
];
const cityName = ref(0);
const monthName = ref(0);
const branchName = ref("今日");
const params = ref<IStatistics>();
const obj = userObj();
const userRoleId = ref(0);
const setValue = function (bol: boolean, state: number, name: string) {
  if (bol) {
    cityName.value = state;
  } else {
    monthName.value = state;
  }
  branchName.value = name;
  params.value = {
    ...params.value,
    date: monthName.value,
    branchId: cityName.value
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
  } = (await getHomeStatistics(params.value!)) as any;
  salesObj.value = sales as any;
  statisticsObj.value = recycle as any;
  publishObj.value = publish as any;
  workOrderObj.value = workOrder as any;
};
// 获取门店
const branchAllList = async () => {
  const { data } = await getAllBranch({});
  cityList.value = [...cityList.value, ...data];
  cityName.value = data[0].id;
  params.value = {
    ...params.value,
    branchId: cityName.value,
    date: monthName.value
  };
  userRoleId.value = obj?.userRole.id;
  await setHomeCardList();
};
// 获取首页统计
onMounted(() => {
  branchAllList();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
.group {
  margin-bottom: 0;
}
</style>
