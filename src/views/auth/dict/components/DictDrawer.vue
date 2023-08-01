<template>
  <el-dialog v-model="drawerVisible" append-to-body :destroy-on-close="true" :title="drawerProps.title">
    <el-form
      ref="dictFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.rowData"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.rowData!.name" placeholder="名称" clearable></el-input>
      </el-form-item>

      <el-form-item label="显示名称" prop="displayName">
        <el-input v-model="drawerProps.rowData!.displayName" placeholder="显示名称" clearable></el-input>
      </el-form-item>

      <el-form-item label="说明" prop="description">
        <el-input v-model="drawerProps.rowData!.description" type="textarea" :rows="4" placeholder="说明" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="UserDrawer">
import { ElMessage, FormInstance } from "element-plus";
import { isEmptyObj } from "@/utils/base";
import { ref, reactive } from "vue";

const rules = reactive({
  name: [{ required: true, message: "请输入名称" }],
  displayName: [{ required: true, message: "请输入展示名称" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  rowData?: any;
  api?: (params: any) => Promise<any>;
  getTableList?: () => Promise<any>;
}

// drawer框状态
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: ""
});

const singleDisabled = ref(false);

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
  drawerProps.value = params;
  drawerVisible.value = true;
  singleDisabled.value = !isEmptyObj(params.rowData);
};

// 提交数据（新增/编辑）
const dictFormRef = ref<FormInstance>();
const handleSubmit = () => {
  dictFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.rowData);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
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
