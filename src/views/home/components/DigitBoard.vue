<template>
  <div class="digit-board">
    <p class="title">{{ title }}</p>
    <p>{{ date }}</p>
    <p class="digit">{{ value }}</p>
    <div class="flex flex-row">
      <div class="mr-5 flex flex-row">
        <span class="label">环比上期: </span>
        <p class="flex items-center ml-2">
          <el-icon v-if="isTop(chainValue)" color="#fc6772">
            <CaretTop />
          </el-icon>
          <el-icon v-else color="#2dca93">
            <CaretBottom />
          </el-icon>
          <span class="value" :style="{ color: isTop(chainValue) ? '#fc6772' : '#2dca93' }"> {{ chainValue }} </span>
        </p>
      </div>
      <div class="flex flex-row">
        <span class="label">同比上期同期:</span>
        <p class="flex items-center ml-2">
          <el-icon v-if="isTop(yearValue)" color="#fc6772">
            <CaretTop />
          </el-icon>
          <el-icon v-else color="#2dca93">
            <CaretBottom />
          </el-icon>
          <span class="value" :style="{ color: isTop(yearValue) ? '#fc6772' : '#2dca93' }"> {{ yearValue }} </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CaretTop, CaretBottom } from "@element-plus/icons-vue";

withDefaults(
  defineProps<{
    title: string;
    date: string;
    value: string | number;
    chainValue: string | number; // 环比
    yearValue: string | number; // 同比
  }>(),
  {
    value: 0,
    chainValue: 0 + "%",
    yearValue: 0 + "%"
  }
);

const isTop = (number: number | string) => {
  const pureValue = parseFloat(number as string);
  return pureValue > 0;
};
</script>

<style scoped lang="scss">
.digit-board {
  font-size: 14px;
  color: #475669;
  background-color: white;
  width: 100%;
  padding: 14px 20px;
  border: 2px #fff solid;
  box-shadow: 0 2px 11px #becada2b;
  border-radius: 3px;

  .title {
    color: #5f6e82;
  }

  .label {
    font-size: 13px;
    color: #8492a6;
  }

  .digit {
    font-size: 40px;
  }
}
</style>
