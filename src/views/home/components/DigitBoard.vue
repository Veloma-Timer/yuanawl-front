<template>
  <div class="digit-board">
    <p class="title">{{ title }}</p>
    <p>{{ date }}</p>
    <p class="digit">{{ value }}</p>
    <div class="flex flex-row">
      <div class="mr-5 flex flex-row">
        <span class="label">环比上期: </span>
        <p class="flex items-center ml-2">
          <el-icon :color="getColor(isTop(chainValue))">
            <CaretTop v-if="isTop(chainValue) == '1'" />
            <CaretBottom v-else />
          </el-icon>
          <span class="value" :style="{ color: getColor(isTop(chainValue)) }"> {{ chainValue }} </span>
        </p>
      </div>
      <div class="flex flex-row">
        <span class="label">同比上期同期:</span>
        <p class="flex items-center ml-2">
          <el-icon :color="getColor(isTop(yearValue))">
            <CaretTop v-if="isTop(yearValue) == '1'" />
            <CaretBottom v-else />
          </el-icon>
          <span class="value" :style="{ color: getColor(isTop(yearValue)) }"> {{ yearValue }} </span>
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

  if (pureValue == 0) {
    return "-1";
  }

  return pureValue > 0 ? "1" : "0";
};

const getColor = (code: "-1" | "0" | "1"): string => {
  const colorMap = {
    "-1": "#5f6e82",
    "0": "#2dca93",
    "1": "#fc6772"
  };
  return colorMap[code];
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
