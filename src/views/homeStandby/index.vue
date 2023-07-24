<template>
  <div class="home table-box">
    <div class="home-tab mb30 flex">
      <div class="tab-list flex ml34">
        <el-form :inline="true">
          <el-form-item label="时间段">
            <el-select v-model="monthName" placeholder="请选择时间段" @change="setValue">
              <el-option v-for="item in monthList" :key="item.id" :label="item.branchName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="mb-10" v-if="userInfoObj">
      <h4 class="mb-3">员工基本信息</h4>
      <div class="flex">
        <div class="w-1/3">
          <p class="mb-3">所属门店: {{ userInfoObj.branch }}</p>
          <p class="mb-3">所属角色: {{ userInfoObj.role }}</p>
          <p>所在组: {{ userInfoObj.role }}</p>
        </div>
        <div class="w-1/3">
          <p class="mb-3">员工姓名: {{ userInfoObj.name }}</p>
          <p class="mb-3">员工工号: {{ userInfoObj.code }}</p>
          <p>手机号: {{ userInfoObj.name }}</p>
        </div>
      </div>
    </div>
    <homeSale
      v-if="salesObj"
      title="销售数据汇总"
      :sales-obj="salesObj"
      :branch-names="branchNames"
      :branch-name="branchName"
      @get-sales-list="getSalesList"
    />
    <homeRecovery
      v-if="statisticsObj"
      title="回收数据汇总"
      :statistics-obj="statisticsObj"
      :branch-names="branchNames"
      :branch-name="branchName"
      @get-reuse-list="getReuseList"
    />
    <homeRelease v-if="publishObj" :publish-obj="publishObj" :branch-name="branchName" title="发布数据汇总" />
    <homeNeed
      v-if="workOrderObj"
      :work-order-obj="workOrderObj"
      :branch-names="branchNames"
      :branch-name="branchName"
      title="待办工单"
    />
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted } from "vue";
import homeSale from "@/views/home/modules/home-sale/index.vue";
import homeRecovery from "@/views/home/modules/home-recovery/index.vue";
import homeRelease from "@/views/home/modules/home-release/index.vue";
import homeNeed from "@/views/home/modules/home-need/index.vue";
import { getUserProfile, homeSalesAndAfter, homeSalesChannel, homeSalesRecycle, IStatistics } from "@/api/modules/home";
import { HomeSet } from "@/api/interface";
import { useRoute } from "vue-router";
import { sellKeyGrouping, sellKeyMap } from "@/api/modules/dictionary";
const route = useRoute();
interface Item {
  branchName: string;
  id: number | null;
}
interface userObj {
  branch: string;
  branchId: number;
  code: string;
  name: string;
  role: string;
  set: string;
  tel: string;
}
const monthList: Item[] = [
  { branchName: "今日", id: 0 },
  { branchName: "本周", id: 1 },
  { branchName: "本月", id: 2 }
];
const monthName = ref(0);
const branchName = ref("今日");
const branchNames = ref("今日");
const params = ref<IStatistics>();
const paramsHome = ref();
let userInfoObj: userObj = reactive({});
const setValue = function (id: number) {
  const value = monthList.find(item => item.id === id);
  branchName.value = value.branchName;
  branchNames.value = value.branchName;
  params.value = {
    ...params.value,
    userId: id,
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
    data: { publishPlatform = [] }
  } = await sellKeyMap();
  const {
    data: { grouping = [] }
  } = await sellKeyGrouping();
  let {
    data: { sales, recycle, publish, workOrder, userInfo }
  } = (await getUserProfile(params.value!)) as any;
  userInfoObj = userInfo as any;
  paramsHome.value = {
    ...paramsHome.value,
    branchId: userInfoObj?.branchId,
    date: monthList[0].id
  };
  const { data } = await homeSalesAndAfter(paramsHome.value);
  const resChannel = await homeSalesChannel(paramsHome.value);
  const resRecycle = await homeSalesRecycle(paramsHome.value);
  if (sales) {
    salesObj.value = {
      ...sales,
      sales: data.sales,
      resChannel: resChannel.data,
      channelList: publishPlatform,
      channelId: publishPlatform[0].value
    };
  }
  if (recycle) {
    statisticsObj.value = {
      ...recycle,
      resRecycle: resRecycle.data,
      channelList: grouping,
      channelId: grouping[0].id
    };
  }
  if (workOrder) {
    workOrderObj.value = {
      ...workOrder,
      afterSales: data.afterSales
    };
  }
  publishObj.value = publish as any;
};
const getSalesList = async id => {
  paramsHome.value = {
    ...paramsHome.value,
    channelId: id
  };
  const resChannel = await homeSalesChannel(paramsHome.value);
  salesObj.value = {
    ...salesObj.value,
    resChannel: resChannel.data,
    channelId: id
  };
};
const getReuseList = async id => {
  paramsHome.value = {
    ...paramsHome.value,
    grouping: id
  };
  const resRecycle = await homeSalesRecycle(paramsHome.value);
  statisticsObj.value = {
    ...statisticsObj.value,
    resRecycle: resRecycle.data,
    channelId: id
  };
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
