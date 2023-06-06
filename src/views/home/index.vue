<template>
  <div class="home">
    <div class="home-tab mb30 flex">
      <div class="tab-list flex clear">
        <div
          class="tab-list-item"
          v-for="item in cityList"
          :class="{ active: cityName === item.value }"
          :key="item.value"
          @click="setValue(true, item.value)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="tab-list flex ml34">
        <div
          class="tab-list-item"
          v-for="item in monthList"
          :class="{ active: monthName === item.value }"
          :key="item.value"
          @click="setValue(false, item.value)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <!--    卡片-->
    <homeCard />
    <!--    占比-->
    <homeProportion />
    <homeNameList />
    <div class="pb30">
      <home-group title="销售组数据对比" />
      <home-group title="回收组数据对比" />
      <home-group title="售后组数据对比" />
      <home-group title="发布组数据对比" class-name="group" />
    </div>
  </div>
</template>

<script setup lang="ts" name="home">
import { ref } from "vue";
import homeCard from "@/views/home/modules/home-crad/index.vue";
import homeProportion from "@/views/home/modules/home-proportion/index.vue";
import homeNameList from "@/views/home/modules/home-nameList/index.vue";
import homeGroup from "@/views/home/modules/home-group/index.vue";
interface Item {
  name: string;
  value: number;
}

const cityList: Item[] = [
  { name: "全部", value: 0 },
  { name: "杭州", value: 1 },
  { name: "信阳", value: 2 }
];
const monthList: Item[] = [
  { name: "本日", value: 0 },
  { name: "本周", value: 1 },
  { name: "本月", value: 2 }
];
let cityName = ref(0);
let monthName = ref(0);
const setValue = function (bol: boolean, state: number) {
  if (bol) {
    return (cityName.value = state);
  }
  return (monthName.value = state);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
.group {
  margin-bottom: 0;
}
</style>
