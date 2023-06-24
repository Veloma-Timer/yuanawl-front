<template>
  <div class="home-name">
    <div class="home-name-left">
      <div class="name-left-bottom">
        <div class="flex">
          <div class="left-progress mt30">
            <el-progress type="circle" :percentage="nameList.length" :width="197">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}个</span>
                <span class="percentage-label">总未处理</span>
              </template>
            </el-progress>
          </div>
          <div class="left-progress mt30">
            <el-progress type="circle" :percentage="nameList.length" :width="197">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}个</span>
                <span class="percentage-label">今日完成</span>
              </template>
            </el-progress>
          </div>
          <div class="left-table mr-20">
            <div class="table-item flx-align-center" v-for="item in nameList" :key="item.id">
              <div class="operate">【待处理】</div>
              <div class="content">订单[{{ item.orderCode }}]</div>
              <div class="bottom" @click="setRouterLink(item)">立即处理&gt;</div>
            </div>
          </div>
          <div class="left-table">
            <div class="table-item flx-align-center" v-for="item in nameList" :key="item.id">
              <div class="operate">【待处理】</div>
              <div class="content">订单[{{ item.orderCode }}]</div>
              <div class="bottom" @click="setRouterLink(item)">立即处理&gt;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { homeOrder } from "@/api/modules/home";
import { defineProps, reactive, toRef, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
interface plat {
  branch: string;
  index: number;
  name: string;
  salas: number;
}
let platformList: plat[] | undefined = reactive([]);
let nameList = reactive([]);
const myArrayRef = toRef(props, "platformSalas");
const getNameList = async () => {
  const { data } = await homeOrder({ pageSize: 5, pageNum: 1 });
  nameList = data.list || [];
};
const setRouterLink = item => {
  router.push({
    path: "/afterSales/orderSummary",
    query: {
      orderCode: item.orderCode
    }
  });
};
const props = defineProps({
  platformSalas: {
    type: Array,
    default: () => []
  },
  salasRanking: {
    type: Array,
    default: () => []
  }
});
watch(myArrayRef, newValue => {
  platformList = newValue;
});
getNameList();
</script>
<style scoped lang="scss">
.home-name {
  display: flex;
  flex-wrap: wrap;
  .home-name-left {
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    .name-left-bottom {
      width: 100%;
      //width: 780px;
      //height: 300px;
      padding: 20px 46px 32px 26px;
      .left-title {
        font-size: 18px;
        color: #333333;
      }
      .left-progress {
        //width: calc(100% - 465px);
        margin-right: 50px;
      }
      .left-table {
        width: 412px;
        .table-item {
          width: 100%;
          height: 41px;
          padding: 0 16px;
          margin-bottom: 7px;
          background: #ffffff;
          border: 2px solid #f0f0f0;
          border-radius: 21px;
          .operate {
            width: 80px;
            font-size: 16px;
            font-weight: normal;
            color: #f85d5d;
          }
          .content {
            flex: 1;
            font-size: 16px;
            color: #333333;
          }
          .bottom {
            width: 90px;
            height: 28px;
            font-size: 12px;
            font-weight: normal;
            line-height: 28px;
            color: #ffffff;
            text-align: center;
            cursor: pointer;
            background: #f85d5d;
            border-radius: 14px;
          }
          &:last-child {
            margin: 0;
          }
        }
      }
    }
  }
}
@media (width <= 1366px) {
  .home-name-left {
    display: block !important; /* 在此处添加你的样式 */
    .name-left-top {
      width: 100% !important;
    }
    .name-left-bottom {
      width: 100% !important;
    }
  }
}
</style>
