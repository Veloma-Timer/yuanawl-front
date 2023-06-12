<template>
  <el-dialog v-model="drawerVisible" :title="`${drawerProps.title}开户`" width="600px">
    <!--    <template #header>-->
    <!--      <Header :title="`${drawerProps.title}开户`" class="header" style="transform: translateY(7px)"></Header>-->
    <!--      <el-button type="primary" @click="edit" class="edit-btn">-->
    <!--        <div>编辑</div>-->
    <!--      </el-button>-->
    <!--    </template>-->
    <el-form
      ref="ruleFormRef"
      label-width="200px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="开户人姓名" prop="openAccountName">
        <el-input v-model="drawerProps.row!.openAccountName" placeholder="请输入开户人姓名" clearable />
      </el-form-item>
      <el-form-item label="开户号码" prop="openAccountNumber">
        <el-input v-model="drawerProps.row!.openAccountNumber" placeholder="请输入开户号码" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
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
const edit = () => {
  drawerProps.value.isView = false;
  console.log("编辑");
};
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

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
