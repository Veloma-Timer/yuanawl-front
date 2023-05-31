<template>
  <div class="header">
    <span class="title">{{ props.title }}</span>
  </div>
</template>

<script setup lang="ts">
interface HeaderProps {
  title: string;
}
const props = withDefaults(defineProps<HeaderProps>(), {
  title: ""
});
</script>

<style scoped lang="scss">
.title {
  padding: 14px 20px;
  font-size: 14px;
  line-height: 40px;
  color: #367fa2;
  border-bottom: 3px solid var(--el-color-primary);
}
</style>
