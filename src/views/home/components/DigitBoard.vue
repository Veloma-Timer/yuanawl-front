<template>
  <div class="digit-board">
    <p class="title">{{ title }}</p>
    <p>{{ date }}</p>

    <el-tooltip class="box-item" :content="String(value)" placement="top">
      <p class="digit truncate">{{ value }}</p>
    </el-tooltip>

    <div class="flex flex-row">
      <el-tooltip class="box-item" :content="getAyerMsg(isTop(chainValue), chainValue)" placement="top">
        <div class="flex flex-row w-1/2">
          <span class="label truncate">环比上期</span>
          <p class="flex items-center ml-2">
            <el-icon :color="getColor(isTop(chainValue))">
              <CaretTop v-if="isTop(chainValue) == '1'" />
              <CaretBottom v-else />
            </el-icon>
            <span class="truncate inline-block" :style="{ width: '50px', color: getColor(isTop(chainValue)) }">
              {{ formatNumber(chainValue) }}
            </span>
          </p>
        </div>
      </el-tooltip>
      <el-tooltip class="box-item" :content="getYoyMsg(isTop(yearValue), yearValue)" placement="top">
        <div class="flex flex-row w-1/2">
          <span class="label truncate">同比上期</span>
          <p class="flex items-center ml-2">
            <el-icon :color="getColor(isTop(yearValue))">
              <CaretTop v-if="isTop(yearValue) == '1'" />
              <CaretBottom v-else />
            </el-icon>
            <span class="truncate" :style="{ width: '50px', color: getColor(isTop(yearValue)) }">
              {{ formatNumber(yearValue) }}
            </span>
          </p>
        </div>
      </el-tooltip>
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

// 环比信息
const getAyerMsg = (isTop: "-1" | "1" | "0", value: string | number) => {
  const topMap = {
    "-1": "持平",
    "1": "增加",
    "0": "减少"
  };
  return `环比上期 ${topMap[isTop]} ${Math.abs(value as number)}`;
};

// 同比信息
const getYoyMsg = (isTop: "-1" | "1" | "0", value: string | number) => {
  const topMap = {
    "-1": "持平",
    "1": "增加",
    "0": "减少"
  };
  return `同比上期 ${topMap[isTop]} ${Math.abs(value as number)}`;
};

const getColor = (code: "-1" | "0" | "1"): string => {
  const colorMap = {
    "-1": "#5f6e82",
    "0": "#2dca93",
    "1": "#fc6772"
  };
  return colorMap[code];
};

const formatNumber = (value: string | number) => {
  if (typeof value === "string") {
    return value;
  }
  return Math.abs(value as number);
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
  transition: border 0.25s ease-in;

  &:hover {
    border: 2px solid var(--el-color-primary);
  }

  .title {
    color: #5f6e82;
  }

  .label {
    width: 38px;
    font-size: 13px;
    color: #8492a6;
  }

  .digit {
    font-size: 38px;
  }
}
</style>
