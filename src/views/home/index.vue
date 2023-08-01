<template>
  <div ref="scrollNum" class="home table-box">
    <div class="home-tab mb30 flex">
      <div v-show="userRoleId === 1">
        <el-form :inline="true">
          <el-form-item label="部门">
            <el-select class="mr-10" v-model="institution" placeholder="请选择部门" @change="setInstitution">
              <el-option v-for="item in institutionList" :key="item.id" :label="item.branchName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="门店">
            <el-select class="mr-10" v-model="cityName" placeholder="请选择门店" @change="setValue1">
              <el-option v-for="item in cityList" :key="item.id" :label="item.branchName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间段">
            <el-select v-model="monthName" placeholder="请选择时间段" @change="setValue">
              <el-option v-for="item in monthList" :key="item.id" :label="item.branchName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <homeSale
      v-if="setValueNone(salesObj, institution, 0)"
      :sales-obj="salesObj"
      :branch-names="branchNames"
      :branch-name="branchName"
      title="销售数据汇总"
      @get-sales-list="getSalesList"
    />
    <homeRecovery
      v-if="setValueNone(statisticsObj, institution, 1)"
      :statistics-obj="statisticsObj"
      :branch-name="branchName"
      :branch-names="branchNames"
      title="回收数据汇总"
      @get-reuse-list="getReuseList"
    />
    <homeRelease
      v-if="setValueNone(publishObj, institution, 2)"
      :publish-obj="publishObj"
      :branch-name="branchName"
      title="发布数据汇总"
    />
    <homeNeed
      v-if="setValueNone(workOrderObj, institution, 3)"
      :work-order-obj="workOrderObj"
      :branch-name="branchName"
      :branch-names="branchNames"
      title="待办工单"
    />
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted, UnwrapRef, Ref } from "vue";
import homeSale from "@/views/home/modules/home-sale/index.vue";
import homeRecovery from "@/views/home/modules/home-recovery/index.vue";
import homeRelease from "@/views/home/modules/home-release/index.vue";
import homeNeed from "@/views/home/modules/home-need/index.vue";
import { getAllBranch } from "@/api/modules/set";
import { getHomeStatistics, homeSalesAndAfter, homeSalesChannel, homeSalesRecycle, IStatistics } from "@/api/modules/home";
import { userObj } from "@/views/home/modules/homeUtis";
import { HomeSet } from "@/api/interface";
import { onBeforeRouteLeave } from "vue-router";
import { sellKeyGrouping, sellKeyMap } from "@/api/modules/dictionary";
interface Item {
  branchName: string;
  id: number | null;
}
const cityList = ref([]);
const institution = ref(null);
const scrollNum = ref<number>();
const monthList: Item[] = [
  { branchName: "今日", id: 0 },
  { branchName: "本周", id: 1 },
  { branchName: "本月", id: 2 },
  { branchName: "本季度", id: 3 },
  { branchName: "本年", id: 4 },
  { branchName: "全部", id: 9 }
];
const institutionList: Item[] = [
  { branchName: "全部", id: null },
  { branchName: "销售", id: 0 },
  { branchName: "回收", id: 1 },
  { branchName: "发布", id: 2 },
  { branchName: "工单", id: 3 }
];
const cityName = ref();
const monthName = ref(9);
const branchName = ref("今日");
const branchNames = ref("今日");
const params = ref<IStatistics>();
const paramsHome = ref();
const obj = userObj();
const userRoleId = ref(0);
const scroll: Ref<UnwrapRef<string>> = ref("0");
const setValueNone = (obj: any, value: any, num: number) => {
  if (value === null && obj) return true;
  if (value === num) return true;
};
const setInstitution = (id: number) => {
  const objects = {
    0: salesObj,
    1: statisticsObj,
    2: publishObj
  };
  if (objects.hasOwnProperty(id)) {
    setValueNone(objects[id], institution.value, id);
  } else {
    setValueNone(workOrderObj, institution.value, id);
  }
};
const setValue = function (id) {
  const value = monthList.find(item => item.id === id);
  branchName.value = value.branchName;
  branchNames.value = value.branchName;
  params.value = {
    ...params.value,
    date: monthName.value
  };
  paramsHome.value = {
    ...paramsHome.value,
    date: monthName.value
  };
  setHomeCardList();
};
const setValue1 = function (id) {
  params.value = {
    ...params.value,
    branchId: cityName.value
  };
  paramsHome.value = {
    ...paramsHome.value,
    branchId: id
  };
  setHomeCardList();
};
const salesObj = ref<HomeSet.ISalesStatistics>(); // 销售组
const statisticsObj = ref<HomeSet.IRecycleStatistics>(); // 回收组
const publishObj = ref<HomeSet.IPublishStatistics>(); // 发布组
const workOrderObj = ref<HomeSet.IAfterSalesStatistics>(); // 售后
const setHomeCardList = async () => {
  const {
    data: { publishPlatform = [] }
  } = await sellKeyMap();
  const {
    data: { grouping = [] }
  } = await sellKeyGrouping();
  const {
    data: { sales, recycle, publish, workOrder }
  } = (await getHomeStatistics(params.value!)) as any;

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
  paramsHome.value = {
    ...paramsHome.value,
    channelId: publishPlatform[0].value,
    grouping: grouping[0].id
  };
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
const branchAllList = async () => {
  const { data } = await getAllBranch({});
  cityList.value = [...cityList.value, ...data];
  cityName.value = data[0].id;
  params.value = {
    ...params.value,
    branchId: cityName.value,
    date: monthName.value
  };
  paramsHome.value = {
    ...paramsHome.value,
    branchId: cityList.value[0].id,
    date: monthList[0].id
  };
  userRoleId.value = obj?.userRole.id;
  await setHomeCardList();
  await getScroll();
};
// 获取首页统计
onMounted(() => {
  branchAllList();
});
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前位置进行一个保存
  scroll.value = scrollNum.value?.scrollTop;
  sessionStorage.setItem("scrollTop", scroll.value);
  next();
});
const getScroll = () => {
  const scrollValue = sessionStorage.getItem("scrollTop");
  nextTick(() => {
    if (scrollValue) {
      scrollNum.value!.scrollTop = Number(scrollValue);
    } else {
      scrollNum.value!.scrollTop = 0;
    }
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
.group {
  margin-bottom: 0;
}
</style>
