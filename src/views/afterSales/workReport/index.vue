<template>
  <div class="card">
    <order-chart-panel />
    <order-list-table />
  </div>
</template>

<script setup lang="ts">
import OrderChartPanel from "./modules/order-chart-panel/index.vue";
import OrderListTable from "./modules/order-list-table/index.vue";
</script>

<style scoped lang="scss"></style>
