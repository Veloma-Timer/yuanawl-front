<template>
  <div class="card">
    <order-chart-panel @change-id="changeId" />
    <order-list-table :select-branch-id="selectBranchId" />
  </div>
</template>

<script setup lang="ts">
import OrderChartPanel from "./modules/order-chart-panel/index.vue";
import OrderListTable from "./modules/order-list-table/index.vue";

// 当前选择的店铺id
const selectBranchId = ref();

function changeId(id: number) {
  selectBranchId.value = id;
}
</script>

<style scoped lang="scss"></style>
