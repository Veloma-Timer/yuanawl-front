<template>
  <el-dialog v-model="dialogVisible" title="权限" width="50%">
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button>取消</el-button>
        <el-button type="primary">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
const dialogVisible = ref(false);
</script>
<style scoped lang="scss"></style>
