<template>
  <el-dialog v-model="dialogVisible" title="个人信息" width="500px" draggable>
    <div class="that-person">
      <p>
        <span>所在组: </span>
        {{ setName(oldUserObj) }}
      </p>
      <p>
        <span>门店: </span>
        {{ oldUserObj.branch!.branchName }}
      </p>
      <p>
        <span>账号: </span>
        {{ oldUserObj.user!.userAccount }}
      </p>
      <p>
        <span>姓名: </span>
        {{ oldUserObj.user!.userName }}
      </p>
      <p>
        <span>角色: </span>
        {{ oldUserObj.role!.roleName }}
      </p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
import { decryption } from "@/utils/AESUtil";

const dialogVisible = ref(false);
let oldUserObj = ref({});
const token = userStore.token;
const obj = JSON.parse(decryption("token", token));
const openDialog = () => {
  oldUserObj.value = obj;
  dialogVisible.value = true;
};
// eslint-disable-next-line vue/return-in-computed-property
const setName = obj => {
  const setId = obj.user.setId;
  const { value = [] } = obj.user.set || {};
  const item = value.find(item => item.value === setId);
  return item.label;
};
defineExpose({ openDialog });
</script>
<style lang="scss" scoped>
.that-person {
  p {
    margin: 10px 0;
    font-size: 16px;
    span {
      display: inline-block;
      width: 60px;
      font-weight: bold;
      color: #333333;
    }
  }
}
</style>
