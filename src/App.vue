<template>
  <ul class="flex flex-row">
    <li>1</li>
    <li>2</li>
    <li>3</li>
  </ul>
  <!-- <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider> -->
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/modules/global";
import { useTheme } from "@/hooks/useTheme";
import { reactive, computed } from "vue";

const globalStore = useGlobalStore();

// init theme
const { initTheme } = useTheme();
initTheme();

// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize);

// element button config
const buttonConfig = reactive({ autoInsertSpace: false });
</script>
