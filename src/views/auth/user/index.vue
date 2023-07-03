<template>
  <div class="tree-box">
    <el-tree :data="dataList" :props="defaultProps" class="w-1/2">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span class="cursor-pointer" @click="setRouter(data)">
            {{ node.label }}
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { getUserTree } from "@/api/modules/user";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const defaultProps = {
  children: "children",
  label: "name"
};
const setRouter = data => {
  console.log(data);
  // router.push({
  //   path: "/homeStandby/index",
  //   query: {
  //     id: data.id
  //   }
  // });
};
let dataList = ref([]);
const getTableList = () => {
  getUserTree().then(res => {
    const { data } = res as object;
    dataList.value = data.list;
  });
};
getTableList();
</script>
<style scoped lang="scss">
.tree-box {
  height: 100%;
  padding: 20px;
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
