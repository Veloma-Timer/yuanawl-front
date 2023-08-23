import { createApp } from "vue";
import App from "./App.vue";
// reset style sheet
import "@/styles/reset.scss";
// CSS common style sheet
import "@/styles/common.scss";
// iconfont css
import "@/assets/iconfont/iconfont.scss";
// font css
import "@/assets/fonts/font.scss";
// element css
import "element-plus/dist/index.css";
// element dark css
import "element-plus/theme-chalk/dark/css-vars.css";
// custom element dark css
import "@/styles/theme/element-dark.scss";
// custom element css
import "@/styles/element.scss";
import "@/styles/tailwindcss.css";
// svg icons
import "virtual:svg-icons-register";
import "default-passive-events";
// element plus
import ElementPlus from "element-plus";
// element icons
import * as Icons from "@element-plus/icons-vue";
// custom directives
import directives from "@/directives/index";
// vue Router
import router from "@/routers";
// vue i18n
import I18n from "@/languages/index";
// pinia store
import pinia from "@/stores";
// errorHandler
import errorHandler from "@/utils/errorHandler";
const app = createApp(App);

app.config.errorHandler = errorHandler;

// register the element Icons component
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

import { checkUpdate, installUpdate, onUpdaterEvent } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";

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

app.use(ElementPlus).use(directives).use(router).use(I18n).use(pinia).mount("#app");
