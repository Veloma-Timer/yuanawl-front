<template>
  <el-dialog v-model="drawerVisible" append-to-body :destroy-on-close="true" :title="drawerProps.title">
    <el-form
      ref="dictItemFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.rowData"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="名称" prop="label">
        <el-input v-model="drawerProps.rowData!.label" placeholder="名称" clearable></el-input>
      </el-form-item>

      <el-form-item label="值" prop="id">
        <el-input
          v-model="drawerProps.rowData!.id"
          :disabled="drawerProps.title === '编辑'"
          placeholder="默认值"
          clearable
        ></el-input>
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
import { ref, reactive } from "vue";

const rules = reactive({
  label: [{ required: true, message: "请输入名称" }],
  id: [{ required: true, message: "请输入值" }]
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

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const dictItemFormRef = ref<FormInstance>();
const handleSubmit = () => {
  dictItemFormRef.value!.validate(async valid => {
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
