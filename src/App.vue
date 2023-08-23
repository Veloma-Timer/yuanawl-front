<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { getBrowserLang } from "@/utils";
import { useTheme } from "@/hooks/useTheme";
import { ElConfigProvider } from "element-plus";
import { LanguageType } from "./stores/interface";
import { useGlobalStore } from "@/stores/modules/global";
import { checkUpdate, installUpdate, onUpdaterEvent } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";

import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const globalStore = useGlobalStore();

// init theme
const { initTheme } = useTheme();
initTheme();

// init language
const i18n = useI18n();
onMounted(async () => {
  const language = globalStore.language ?? getBrowserLang();
  i18n.locale.value = language;
  globalStore.setGlobalState("language", language as LanguageType);

  const unlisten = await onUpdaterEvent(({ error, status }) => {
    // This will log all updater events, including status updates and errors.
    console.log("Updater event", error, status);
  });

  try {
    const { shouldUpdate, manifest } = await checkUpdate();

    if (shouldUpdate) {
      // You could show a dialog asking the user if they want to install the update here.
      console.log(`Installing update ${manifest?.version}, ${manifest?.date}, ${manifest?.body}`);

      // Install the update. This will also restart the app on Windows!
      await installUpdate();

      // On macOS and Linux you will need to restart the app manually.
      // You could use this step to display another confirmation dialog.
      await relaunch();
    }
  } catch (error) {
    console.error(error);
  }

  // you need to call unlisten if your handler goes out of scope, for example if the component is unmounted.
  unlisten();
});

// element language
const locale = computed(() => {
  if (globalStore.language == "zh") return zhCn;
  if (globalStore.language == "en") return en;
  return getBrowserLang() == "zh" ? zhCn : en;
});

// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize);

// element button config
const buttonConfig = reactive({ autoInsertSpace: false });
</script>

<style>
.table-box {
  padding: 10px;
  background-color: var(--el-bg-color-page);
}
</style>
