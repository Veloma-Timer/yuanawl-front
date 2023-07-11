import { useUserStore } from "@/stores/modules/user";
import { decryption } from "@/utils/AESUtil";

export const setValues = (obj: any, key: string) => {
  return Object.values(obj).map((item: any) => {
    return item[key] || "--";
  });
};
export const userObj = () => {
  const userStore = useUserStore();
  const token = userStore.token;
  const obj = JSON.parse(decryption("token", token)) || {};
  return obj.user || {};
};
