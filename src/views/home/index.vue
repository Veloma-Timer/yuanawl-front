<template>
  <div ref="scrollNum" class="home table-box">
    <div class="home-tab mb30 flex">
      <div v-show="userRoleId === 1">
        <el-select v-model="institution" placeholder="请选择" @change="setInstitution">
          <el-option v-for="item in institutionList" :key="item.id" :label="item.branchName" :value="item.id" />
        </el-select>
      </div>
      <div class="flex">
        <div class="tab-list flex clear">
          <el-button-group v-show="userRoleId === 1">
            <el-button type="primary" v-for="item in cityList" :key="item.id" @click="setValue(true, item.id, '')">
              {{ item.branchName }}
            </el-button>
          </el-button-group>
        </div>
        <div class="tab-list flex ml34">
          <el-button-group>
            <el-button type="primary" v-for="item in monthList" :key="item.id" @click="setValue(false, item.id, item.branchName)">
              {{ item.branchName }}
            </el-button>
          </el-button-group>
        </div>
      </div>
    </div>
    <homeSale
      v-if="setValueNone(salesObj, institution, 0)"
      :sales-obj="salesObj"
      :branch-name="branchName"
      title="销售数据汇总"
    />
    <homeRecovery
      v-if="setValueNone(statisticsObj, institution, 1)"
      :statistics-obj="statisticsObj"
      :branch-name="branchName"
      title="回收数据汇总"
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
import { getHomeStatistics, IStatistics } from "@/api/modules/home";
import { userObj } from "@/views/home/modules/homeUtis";
import { HomeSet } from "@/api/interface";
import { onBeforeRouteLeave } from "vue-router";
interface Item {
  branchName: string;
  id: number | null;
}
const cityList = ref([{ branchName: "全部", id: null }]);
const institution = ref(null);
const scrollNum = ref<InstanceType<typeof scrollNum> | null>(null);
const monthList: Item[] = [
  { branchName: "今日", id: 0 },
  { branchName: "本周", id: 1 },
  { branchName: "本月", id: 2 }
];
const institutionList: Item[] = [
  { branchName: "销售", id: 0 },
  { branchName: "回收", id: 1 },
  { branchName: "发布", id: 2 },
  { branchName: "工单", id: 3 }
];
const cityName = ref();
const monthName = ref();
const branchName = ref("全部");
const params = ref<IStatistics>();
const obj = userObj();
const userRoleId = ref(0);
const scroll: Ref<UnwrapRef<number>> = ref(0);
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
const setValue = function (bol: boolean, state: any, name: string) {
  if (bol) {
    cityName.value = state;
  } else {
    monthName.value = state;
    branchName.value = name;
  }
  params.value = {
    ...params.value,
    date: monthName.value,
    branchId: cityName.value
  };
  setHomeCardList();
};
const salesObj = ref<HomeSet.ISalesStatistics>(); // 销售组
const statisticsObj = ref<HomeSet.IRecycleStatistics>(); // 回收组
const publishObj = ref<HomeSet.IPublishStatistics>(); // 发布组
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
  // cityName.value = data[0].id;
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
// 跳转路由守卫
onBeforeRouteLeave((to, from, next) => {
  // 将当前位置进行一个保存
  scroll.value = scrollNum.value.scrollTop;
  next();
});
console.log(scroll);
</script>

<style scoped lang="scss">
@import "./index.scss";
.group {
  margin-bottom: 0;
}
</style>
