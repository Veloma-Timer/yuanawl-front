<template>
  <div class="home-name">
    <div class="home-name-left flex">
      <div class="name-left-top">
        <div class="top-title">平台销售总额</div>
        <div class="top-content flex">
          <div class="top-champion" v-for="(item, index) in platformList" :key="index + item.name">
            <div class="champion-button mb16">
              <img v-show="index === 0" src="@/assets/images/champion.png" alt="" />
              {{ item.name }}
            </div>
            <i>￥{{ item.salas }}</i>
          </div>
        </div>
      </div>
      <div class="name-left-bottom">
        <span class="left-title">待办工单</span>
        <div class="flex">
          <div class="left-progress mt30">
            <el-progress type="circle" :percentage="nameList.length" :width="197">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}个</span>
                <span class="percentage-label">待办</span>
              </template>
            </el-progress>
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
    <nameRight :salasRankingArr="props.salasRanking" />
  </div>
</template>
<script setup lang="ts">
import nameRight from "@/views/home/modules/home-nameList/nameRight/index.vue";
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
    .name-left-top {
      width: 780px;
      //height: 300px;
      padding: 30px 36px;
      margin-bottom: 32px;
      color: #ffffff;
      background-image: url("@/assets/images/home-name.png");
      background-size: 100% 100%;
      border-radius: 25px;
      box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
      .top-title {
        width: 100%;
        //height: 24px;
        font-size: 16px;
        font-weight: normal;
        line-height: 24px;
      }
      .top-content {
        align-items: center;
        justify-content: space-around;
        width: 75%;
        //height: calc(100% - 24px);
        margin-left: 25%;
        .top-champion {
          .champion-button {
            position: relative;
            width: 83px;
            height: 20px;
            font-size: 12px;
            font-weight: normal;
            line-height: 20px;
            color: #ffffff;
            text-align: center;
            background: linear-gradient(175deg, #fc58b3 0%, #feae68 100%);
            border-radius: 10px;
            img {
              position: absolute;
              top: -14px;
              left: 50%;
              width: 38px;
              height: 38px;
              transform: translate(-50%, -50%);
            }
          }
          i {
            font-size: 22px;
            font-weight: 700;
          }
        }
      }
    }
    .name-left-bottom {
      width: 780px;
      //height: 300px;
      padding: 20px 46px 32px 26px;
      background: #ffffff;
      border-radius: 25px;
      box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
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
</style>
