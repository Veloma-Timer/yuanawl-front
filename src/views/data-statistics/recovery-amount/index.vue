<template>
  <div class="card table-box">
    <recovery-chart-panel @change-id="changeId" />
    <recovery-list-table :select-branch-id="selectBranchId" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RecoveryChartPanel from "./modules/recovery-chart-panel/index.vue";
import RecoveryListTable from "./modules/recovery-list-table/index.vue";

// 当前选择的店铺id
const selectBranchId = ref();

function changeId(id: number) {
  selectBranchId.value = id;
}
</script>

<style scoped lang="scss"></style>
