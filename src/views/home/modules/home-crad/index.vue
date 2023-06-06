<template>
  <div class="home-crud">
    <div class="crud-list flex">
      <div v-for="item in crudList" :key="item.id" class="crud-list-item flex">
        <div class="crud-number" ref="crudNumberRef"></div>
        <div class="crud-total">
          <div class="total-name">今日销售总额</div>
          <div class="total-compare">昨日同比</div>
          <div class="total-proportion flex flx-align-center flx-justify-between">
            {{ item.name }}%
            <el-icon><CaretTop /></el-icon>
            <img src="@/assets/images/data.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CaretTop } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
const crudNumberRef = ref<HTMLElement>();
const setNumber = () => {
  let crudNumber = document.getElementsByClassName("crud-number");
  for (let i = 0; i < crudList.length; i++) {
    let option: echarts.EChartsOption = {
      title: {
        text: "80%",
        x: "center",
        y: "center",
        textStyle: {
          fontWeight: "normal",
          color: "#0580f2",
          fontSize: "12"
        }
      },
      color: ["rgba(176, 212, 251, 1)"],
      legend: {
        show: true,
        itemGap: 12
      },
      series: [
        {
          name: "Line 1",
          type: "pie",
          clockWise: true,
          radius: ["50%", "70%"],
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          data: [
            {
              value: 80,
              itemStyle: {
                normal: {
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
                  },
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              }
            },
            {
              value: 20
            }
          ]
        }
      ]
    };
    let myChart: echarts.ECharts = echarts.init(crudNumber[i] as HTMLElement);
    useEcharts(myChart, option);
  }
};
onMounted(() => {
  setNumber();
});
const crudList = [
  { id: 1, name: "22.8" },
  { id: 2, name: "22.8" },
  { id: 3, name: "22.8" },
  { id: 4, name: "22.8" },
  { id: 5, name: "22.8" },
  { id: 6, name: "22.8" }
];
</script>
<style scoped lang="scss">
.home-crud {
  width: 100%;
  .crud-list {
    flex-wrap: wrap;
    width: 100%;
    .crud-list-item {
      width: calc((100% - 80px) / 5);
      height: 181px;
      padding: 18px 22px;
      margin: 0 20px 20px 0;
      background: #ffffff;
      border: 2px solid #f0f0f0;
      border-radius: 10px;
      .crud-number {
        width: 110px;
        height: 100%;
      }
      .crud-total {
        width: calc(100% - 110px);
        height: 100%;
        padding: 26px 0;
        color: #858585;
        .total-name {
          margin-bottom: 13px;
          font-size: 16px;
          font-weight: normal;
        }
        .total-compare {
          margin-bottom: 13px;
          font-size: 8px;
          font-weight: normal;
        }
        .total-proportion {
          font-size: 12px;
          font-weight: normal;
          color: #1cd1a1;
          img {
            width: 75px;
            height: 31px;
          }
        }
      }
      &:nth-child(5n) {
        margin: 0;
      }
    }
  }
}
</style>
