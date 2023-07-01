<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="800px" :show-close="false">
    <template #header>
      <Header :title="`${drawerProps.title}开户`" class="header" style="transform: translateY(7px)"></Header>
      <el-button type="primary" @click="edit" class="edit-btn">
        <div>编辑</div>
      </el-button>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="200px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="问题类型" prop="openAccountName">
        <el-input v-model="drawerProps.row!.openAccountName" placeholder="请输入开户人姓名" clearable />
      </el-form-item>
      <el-form-item label="工单状态" prop="openAccountName">
        <el-input v-model="drawerProps.row!.openAccountName" placeholder="请输入开户人姓名" clearable />
      </el-form-item>
      <el-form-item label="查看工单" prop="transCatUploaded">
        <el-input v-model="drawerProps.row!.openAccountName" placeholder="请输入开户人姓名" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Commodity } from "@/api/interface/commodity/commodity";

const rules = reactive({
  openAccountName: [{ required: true, message: "请输入开户人姓名" }],
  openAccountNumber: [{ required: true, message: "请输入开户号码" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Commodity.phoneLibrary>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
const edit = () => {
  drawerProps.value.isView = false;
};
// 上架
const transCatUploadedMap = [];
// 处理
const handleMap = [
  { label: "第一次循环", value: 1 },
  { label: "第二次循环", value: 2 },
  { label: "第三次循环", value: 3 }
];
const customerMap = [
  { label: "客服1", value: 1 },
  { label: "客服2", value: 2 },
  { label: "客服3", value: 3 }
];
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
<style scoped lang="scss">
.edit-btn {
  div {
    color: var(--el-color-white) !important;
  }
}
</style>
