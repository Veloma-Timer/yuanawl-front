<template>
  <div class="home-right">
    <span class="cell">{{ props.title }}</span>
    <div class="home-table mt30">
      <div class="home-table-header flex">
        <div class="header-item">名次</div>
        <div class="header-item">姓名</div>
        <div class="header-item">销售额</div>
        <div class="header-item">店铺</div>
      </div>
      <div class="home-table-row mt26">
        <div class="table-row-cell flex" v-for="(item, index) in props.salasRankingArr" :key="item.index + index">
          <div class="cell-item">
            <span :class="nameClassObj.get(item.index)">{{ item.index }}</span>
          </div>
          <div class="cell-item">{{ item.name }}</div>
          <div class="cell-item">{{ item.salas }}</div>
          <div class="cell-item">{{ item.branch }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
const nameClassObj = new Map([
  [1, "one"],
  [2, "two"],
  [3, "three"],
  [4, "four"],
  [5, "five"]
]);
const props = defineProps({
  salasRankingArr: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: "平台销售额排名"
  }
});
</script>
<style scoped lang="scss">
.home-right {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 15%);
  .cell {
    font-size: 16px;
    color: #858585;
  }
  .home-table {
    width: 100%;
    .home-table-header {
      width: 100%;
      height: 30px;
      line-height: 30px;
      .header-item {
        width: 25%;
        height: 100%;
        font-size: 12px;
        color: #858585;
        text-align: center;
      }
    }
    .home-table-row {
      width: 100%;
      .table-row-cell {
        width: 100%;
        height: 65px;
        margin-bottom: 10px;
        line-height: 65px;
        text-align: center;
        background: #ffffff;
        border: 2px solid #f0f0f0;
        border-radius: 33px;
        &:last-child {
          margin: 0;
        }
        .cell-item {
          width: 25%;
          height: 100%;
          padding-left: 6px;
          font-size: 12px;
          color: #858585;
          span {
            display: inline-block;
          }
        }
        .one {
          width: 90px;
          height: 28px;
          font-size: 12px;
          font-weight: normal;
          line-height: 28px;
          color: #ffffff;
          text-align: center;
          background: #f85d5d;
          border-radius: 14px;
        }
        .two {
          width: 90px;
          height: 28px;
          font-size: 12px;
          font-weight: normal;
          line-height: 28px;
          color: #ffffff;
          text-align: center;
          background: #5d78f8;
          border-radius: 14px;
        }
        .three {
          width: 90px;
          height: 28px;
          font-size: 12px;
          font-weight: normal;
          line-height: 28px;
          color: #ffffff;
          text-align: center;
          background: linear-gradient(180deg, #e76ba1, #773bb7);
          border-radius: 14px;
        }
        .four {
          width: 90px;
          height: 28px;
          font-size: 12px;
          font-weight: normal;
          line-height: 28px;
          color: #ffffff;
          text-align: center;
          background: #5df888;
          border-radius: 14px;
        }
        .five {
          width: 90px;
          height: 28px;
          font-size: 12px;
          font-weight: normal;
          line-height: 28px;
          color: #ffffff;
          text-align: center;
          background: #f85d5d;
          border-radius: 14px;
        }
      }
    }
  }
}
</style>
