<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <el-tooltip class="box-item" content="选号网后台" placement="top">
        <img src="/small-logo.jpg" alt="元阿选号网后台" class="cursor-pointer" width="20" height="20" @click="onToXuanhao" />
      </el-tooltip>

      <AssemblySize id="assemblySize" />
      <ThemeSetting id="themeSetting" />
      <Message id="message" />
      <Fullscreen id="fullscreen" />
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/modules/user";
import AssemblySize from "./components/AssemblySize.vue";
import ThemeSetting from "./components/ThemeSetting.vue";
import Message from "./components/Message.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";
import { decryption } from "@/utils/AESUtil";

const userStore = useUserStore();
const onToXuanhao = () => {
  window.open("http://yuanawl.com/admin", "_blank");
};
const obj = JSON.parse(decryption("token", userStore.token));
const username = computed(() => obj.user.userAccount);
</script>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
  }
}
</style>
