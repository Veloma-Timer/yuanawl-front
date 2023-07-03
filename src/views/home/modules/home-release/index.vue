<template>
  <div>
    <div class="home-crud">
      <div class="title">{{ props.title }}</div>
      <div class="crud-list flex">
        <div v-for="(item, index) in crudListMap" :key="item + index" class="crud-list-item flex">
          <div class="release-number" ref="releaseRef"></div>
          <div class="crud-total">
            <div class="total-name">
              <span>{{ props.branchName }}{{ namesList[index] }}</span>
            </div>
            <div class="total-compare mb22">昨日同比</div>
            <div class="total-proportion flex flx-align-center flx-justify-between">
              <div>
                <span class="mr-2">{{ item }}</span>
                <el-icon>
                  <CaretTop />
                </el-icon>
              </div>
              <img src="@/assets/images/data.png" alt="" class="w-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-name">
      <div class="home-name-left">
        <homeGroup :list-arr="publishObj?.publishRatio" class-name="maintain" title="账号发布占比" />
      </div>
      <div class="home-name-right">
        <nameRight title="平台发布额排名" :salas-ranking-arr="publishObj?.publishRanking" :header="['用户', '数量', '金额']" />
      </div>
    </div>
    <homeGroup :list-arr="publishUnit" title="发布组数据对比">
      <div class="release-button-list">
        <el-select v-model="publishId" placeholder="查看" filterable @change="setValue">
          <el-option v-for="item in publishObj.publishSetComparison" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
    </homeGroup>
  </div>
</template>
<script setup lang="ts">
import { CaretTop } from "@element-plus/icons-vue";
import { ref, reactive, defineProps, nextTick, watch } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import homeGroup from "@/views/home/modules/home-group/index.vue";
import nameRight from "@/views/home/modules/nameRight/index.vue";
import { HomeSet } from "@/api/interface";
const releaseRef = ref<HTMLElement>();
const namesList: string[] = ["发布金额", "发布数量", "发布均价"];
const publishId = ref();
// 处理数据
const props = withDefaults(
  defineProps<{
    publishObj: HomeSet.IPublishStatistics;
    branchName: string;
    title: string;
  }>(),
  {
    branchName: "今日"
  }
);
const setNumber = () => {
  nextTick(() => {
    let releaseNumber = document.getElementsByClassName("release-number");
    for (let i = 0; i < crudListMap.length; i++) {
      let option = {
        title: {
          text: `￥${crudListMap[i]}`,
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            color: "#0580f2",
            fontSize: "12"
          }
        },
        color: ["rgba(176, 212, 251, 1)"],
        series: [
          {
            name: "Line 1",
            type: "pie",
            clockwise: true,
            radius: ["50%", "70%"],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            emphasis: {
              scale: true // 使用emphasis.scale替代hoverAnimation
            },
            data: [
              {
                value: 20,
                itemStyle: {
                  color: {
                    // 完成的圆环的颜色
                    colorStops: [
                      {
                        offset: 0,
                        color: "#00cefc" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#367bec" // 100% 处的颜色
                      }
                    ]
                  }
                },
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              },
              {
                value: 20
              }
            ]
          }
        ]
      };
      let myChart: echarts.ECharts = echarts.init(releaseNumber[i] as HTMLElement);
      useEcharts(myChart, option);
    }
  });
};
// 处理数据
let crudListMap = reactive([]);
let publishUnit = ref([]);
setNumber();
const setCrud = obj => {
  crudListMap = [obj.publishMoney, obj.publishAmount, obj.publishAveMoney];
  publishUnit.value = obj.publishRatio;
  setNumber();
};
const setValue = (status: number) => {
  const publishSetComparison = props.publishObj.publishSetComparison;
  const values = publishSetComparison.find(item => item.id === status);
  return (publishUnit.value = values.data);
};
watch(
  () => props.publishObj,
  count => {
    crudListMap = [];
    /* ... */
    setCrud(count);
  },
  { deep: true, immediate: true }
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