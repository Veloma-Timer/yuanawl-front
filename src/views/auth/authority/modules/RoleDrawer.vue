<template>
  <el-dialog v-model="drawerVisible" :title="`${drawerProps.title}角色`" width="35%" top="12vh">
    <el-form
      ref="ruleFormRef"
      label-width="160px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="drawerProps.row!.roleName" placeholder="请输入订单编号" clearable />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input
          autosize
          type="textarea"
          v-model="drawerProps.row!.roleDesc"
          placeholder="请输入角色描述"
          clearable
          resize="none"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Author } from "@/api/interface";

const rules = reactive({
  roleName: [{ required: true, message: "请输入角色名称" }],
  roleDesc: [{ required: true, message: "请输入角色描述" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Author.RoleObj>;
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
