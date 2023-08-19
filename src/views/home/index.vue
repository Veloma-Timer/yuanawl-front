<template>
  <div ref="scrollNum" class="home table-box">
    <div class="home-tab mb30 flex">
      <el-form :inline="true">
        <el-form-item v-if="token.isAdmin == '1'" label="部门">
          <!-- <el-select v-model="institution" placeholder="请选择部门" @change="setInstitution"> -->
          <el-select v-model="institution" placeholder="请选择部门">
            <el-option v-for="item in institutionList" :key="item.id!" :label="item.branchName" :value="item.id!" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="token.isAdmin == '1'" label="门店">
          <el-select v-model="cityName" placeholder="请选择门店" @change="setValue1">
            <el-option v-for="item in cityList" :key="item.id" :label="item.branchName" :value="item.id!" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间段">
          <el-date-picker
            v-model="monthName"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            @change="setValue"
          />
        </el-form-item>
      </el-form>
    </div>
    <homeSale
      v-if="setValueNone(0)"
      :sales-obj="salesObj!"
      :branch-names="branchNames"
      :branch-name="branchName"
      title="销售数据汇总"
      @get-sales-list="getSalesList"
    />
    <homeRecovery
      v-if="setValueNone(1)"
      :statistics-obj="statisticsObj!"
      :branch-name="branchName"
      :branch-names="branchNames"
      title="回收数据汇总"
      @get-reuse-list="getReuseList"
    />
    <homeRelease v-if="setValueNone(3)" :publish-obj="publishObj!" :branch-name="branchName" title="发布数据汇总" />
    <homeNeed
      v-if="setValueNone(2)"
      :work-order-obj="workOrderObj!"
      :branch-name="branchName"
      :branch-names="branchNames"
      title="售后数据汇总"
    />
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted } from "vue";
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
import { shortcuts, parseTime } from "@/utils";

interface Item {
  branchName: string;
  id: number;
}

const institutionList: Item[] = [
  { branchName: "销售", id: 0 },
  { branchName: "回收", id: 1 },
  { branchName: "发布", id: 2 },
  { branchName: "工单", id: 3 }
];
const cityName = ref();
const monthName = ref<[string, string]>([parseTime(new Date(), "{y}-{m}-{d}"), parseTime(new Date(), "{y}-{m}-{d}")]);
const branchName = ref();
const branchNames = ref();
const params = ref<IStatistics>();
const paramsHome = ref<IStatistics>();
const token = userObj();

const cityList = ref<{ branchName: string; id: number }[]>([]);
const institution = ref<number>(token.setId);
const scrollNum = ref<number>();

// const userRoleId = ref(0);
const scroll = ref<string>("0");

const setValueNone = (num: number) => {
  if (!institution.value) return true;
  if (institution.value === num) return true;
};

const setValue = (date: [string, string]) => {
  branchName.value = `${date[0]} 至 ${date[1]}`;
  branchNames.value = `${date[0]} 至 ${date[1]}`;

  params.value = { ...params.value, date };
  paramsHome.value = {
    ...paramsHome.value,
    date
  };
  setHomeCardList();
};
const setValue1 = function (id: any) {
  params.value = {
    ...params.value,
    branchId: cityName.value
  };
  paramsHome.value = {
    ...paramsHome.value,
    branchId: id,
    date: monthName.value
  };
  setHomeCardList();
};
const salesObj = ref<HomeSet.ISalesStatistics>(); // 销售组
const statisticsObj = ref<HomeSet.IRecycleStatistics>(); // 回收组
const publishObj = ref<HomeSet.IPublishStatistics>(); // 发布组
const workOrderObj = ref<HomeSet.IAfterSalesStatistics>(); // 售后

// 获取数据
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
const getSalesList = async (id: any) => {
  paramsHome.value = {
    ...paramsHome.value,
    channelId: id
  };
  const resChannel = await homeSalesChannel(paramsHome.value);
  salesObj.value = {
    ...salesObj.value,
    // @ts-ignore
    resChannel: resChannel.data,
    channelId: id
  };
};
const getReuseList = async (id: any) => {
  paramsHome.value = {
    ...paramsHome.value,
    grouping: id
  };
  const resRecycle = await homeSalesRecycle(paramsHome.value);
  statisticsObj.value = {
    ...statisticsObj.value,
    // @ts-ignore
    resRecycle: resRecycle.data,
    channelId: id
  };
};
// 获取门店
const branchAllList = async () => {
  const { data } = await getAllBranch();
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
    date: monthName.value
  };
  // userRoleId.value = obj?.userRole.id;
  await setHomeCardList();
  getScroll();
};
// 获取首页统计
onMounted(() => {
  branchAllList();
});
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前位置进行一个保存
  // @ts-ignore
  scroll.value = scrollNum.value?.scrollTop;
  sessionStorage.setItem("scrollTop", scroll.value);
  next();
});
const getScroll = () => {
  const scrollValue = sessionStorage.getItem("scrollTop");
  nextTick(() => {
    if (scrollValue) {
      // @ts-ignore
      scrollNum.value!.scrollTop = Number(scrollValue);
    } else {
      // @ts-ignore
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
