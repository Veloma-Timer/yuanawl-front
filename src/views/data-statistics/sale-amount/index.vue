<template>
  <div class="card table-box">
    <sale-chart-panel @change-id="changeId" />
    <sale-list-table :select-branch-id="selectBranchId" />
  </div>
</template>

<script setup lang="ts">
import SaleChartPanel from "./modules/sale-chart-panel/index.vue";
import SaleListTable from "./modules/sale-list-table/index.vue";

// 当前选择的店铺id
const selectBranchId = ref();

function changeId(id: number) {
  selectBranchId.value = id;
}
</script>

<style scoped lang="scss"></style>
