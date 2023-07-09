import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/config/piniaPersist";
import { decryption } from "@/utils/AESUtil";

export const useUserStore = defineStore({
  id: "geeker-user",
  state: (): UserState => ({
    token: "",
    userInfo: {}
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
      const obj = JSON.parse(decryption("token", token)) || {};
      this.userInfo = obj.user;
    },
    cleanToken(token: string) {
      this.token = token;
      this.userInfo = {};
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("geeker-user")
});
