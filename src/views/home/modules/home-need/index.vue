<template>
  <div>
    <div class="home-crud">
      <div class="title">{{ props.title }}</div>
      <div class="crud-list flex">
        <homeNameList />
      </div>
    </div>
    <homeGroup :list-arr="publishUnit" title="售后工单类型">
      <div>
        <el-select v-model="value" class="m-2" clearable placeholder="Select">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </homeGroup>
    <homeGroup :list-arr="publishUnit" title="售后组数据对比">
      <el-select v-model="value" class="m-2" clearable placeholder="Select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </homeGroup>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, defineProps, watch } from "vue";
import homeNameList from "@/views/home/modules/home-nameList/index.vue";
import homeGroup from "@/views/home/modules/home-group/index.vue";
// 处理数据
const props = defineProps({
  crudListObj: {
    type: Object,
    default: () => {}
  },
  branchName: {
    type: String,
    default: "今日"
  },
  title: {
    type: String,
    default: ""
  }
});
let publishUnit = reactive([]);
let value = ref("");
const options = [
  {
    value: "Option1",
    label: "Option1"
  },
  {
    value: "Option2",
    label: "Option2"
  },
  {
    value: "Option3",
    label: "Option3"
  },
  {
    value: "Option4",
    label: "Option4"
  },
  {
    value: "Option5",
    label: "Option5"
  }
];
const setCrud = obj => {
  publishUnit = obj.publishUnit;
};

watch(
  () => props.crudListObj,
  count => {
    /* ... */
    setCrud(count);
  }
);
</script>
<style scoped lang="scss">
.home-crud {
  width: 100%;
  padding: 20px;
  background: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 25px;

  .title {
    font-size: 24px;
    font-weight: normal;
    color: #343434;
  }

  .crud-list {
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;

    .crud-list-item {
      width: 33.33%;
      height: 181px;
      padding: 18px 22px;
      margin-bottom: 10px;

      .release-number {
        width: 160px;
        height: 100%;
      }

      .crud-total {
        width: calc(100% - 160px);
        height: 100%;
        padding: 20px 0;
        color: #858585;

        .total-name {
          margin-bottom: 22px;
          font-size: 16px;
          font-weight: normal;
        }

        .total-compare {
          font-size: 8px;
          font-weight: normal;
        }

        .total-proportion {
          position: relative;
          font-size: 12px;
          font-weight: normal;
          color: #1cd1a1;

          img {
            position: absolute;
            right: 0;
            width: 75px;
            height: 31px;
          }
        }
      }

      &:nth-child(4n) {
        margin: 0;
      }
    }
  }

  .home-proportion {
    display: flex;
    margin: 0 0 40px;

    .proportion-item {
      width: calc((100% - 40px) / 2);
      height: 455px;
      padding: 10px 20px;
      margin: 0 40px 0 0;
      background: #ffffff;
      border-radius: 25px;
      box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);

      &:last-child {
        margin: 0;
      }
    }
  }

  .proportion {
    width: 100%;
    height: 455px;
    padding: 10px 20px;
    margin-bottom: 40px;
    background: #ffffff;
    border-radius: 25px;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
  }
}
.home-name {
  display: flex;
  justify-content: space-between;
  margin: 32px 0;
  .home-name-left {
    width: 49%;
    height: 465px;
  }
  .home-name-right {
    width: 49%;
    height: 465px;
  }
}
.release-button-list {
  span {
    display: inline-block;
    width: 62px;
    height: 30px;
    line-height: 28px;
    border: 2px solid #dc463a;
    font-size: 12px;
    font-weight: normal;
    text-align: CENTER;
    color: white;
    background: linear-gradient(180deg, #dc463a, #dc463a);
  }
}
//@media (width <= 1366px) {
//  /* 在此处添加你的样式 */
//  .crud-list-item {
//    width: calc((100% - 40px) / 3) !important;
//
//    &:nth-child(3n) {
//      margin: 0 !important;
//    }
//
//    &:nth-child(4n) {
//      margin: 0 20px 20px 0 !important;
//    }
//  }
//}
</style>
