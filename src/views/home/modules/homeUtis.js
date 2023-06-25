import { useUserStore } from "@/stores/modules/user";
import { decryption } from "@/utils/AESUtil.ts";

export const setValues = (obj, key) => {
  return Object.values(obj).map(item => {
    return item[key];
  });
};
export const userObj = () => {
  const userStore = useUserStore();
  const token = userStore.token;
  const obj = JSON.parse(decryption("token", token)) || {};
  return obj.user || {};
};
