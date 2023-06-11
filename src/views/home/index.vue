<template>
  <div class="home">
    <div class="home-tab mb30 flex">
      <div class="tab-list flex clear">
        <div
          class="tab-list-item"
          v-for="item in cityList"
          :class="{ active: cityName === item.id }"
          :key="item.id"
          @click="setValue(true, item.id)"
        >
          {{ item.branchName }}
        </div>
      </div>
      <div class="tab-list flex ml34">
        <div
          class="tab-list-item"
          v-for="item in monthList"
          :class="{ active: monthName === item.id }"
          :key="item.id"
          @click="setValue(false, item.id)"
        >
          {{ item.branchName }}
        </div>
      </div>
    </div>
    <!--    卡片-->
    <homeCard :crudListObj="crudListObj" />
    <homeNameList :platformSalas="crudListObj.platformSalas" :salasRanking="crudListObj.salasRanking" />
    <div class="pb30">
      <home-group title="销售组数据对比" :listArr="crudListObj.salesUnit" />
      <home-group title="回收组数据对比" :listArr="crudListObj.recycleUnit" />
      <home-group title="售后组数据对比" :listArr="crudListObj.afterSaleUnit" />
      <home-group title="发布组数据对比" class-name="group" :listArr="crudListObj.publishUnit" />
    </div>
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, reactive, onMounted } from "vue";
import homeCard from "@/views/home/modules/home-crad/index.vue";
import homeNameList from "@/views/home/modules/home-nameList/index.vue";
import homeGroup from "@/views/home/modules/home-group/index.vue";
import { getAllBranch } from "@/api/modules/set";
import { getHomeList } from "@/api/modules/home";

interface Item {
  branchName: string;
  id: number;
}

let cityList = ref([]);
const monthList: Item[] = [
  { branchName: "本日", id: 0 },
  { branchName: "本周", id: 1 },
  { branchName: "本月", id: 2 }
];
let cityName = ref(0);
let monthName = ref(0);
let params = reactive({});
const setValue = function (bol: boolean, state: number) {
  if (bol) {
    cityName.value = state;
  } else {
    monthName.value = state;
  }
  params = {
    ...params,
    date: monthName.value,
    branchId: cityName.value
  };
  setHomeCradList(params);
};
let crudListObj = ref({}); // 前13个数据
// let behindObj = null; // 后面的数据
const setHomeCradList = async count => {
  const { data } = await getHomeList(count);
  crudListObj.value = data;
};
// 获取门店
const branchAllList = async () => {
  const { data } = await getAllBranch({});
  cityList.value = data;
  cityName.value = data[0].id;
  params = {
    ...params,
    branchId: cityName.value,
    date: monthName.value
  };
  await setHomeCradList(params);
};
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
