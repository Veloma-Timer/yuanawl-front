<template>
  <el-dialog v-model="drawerVisible" :title="`${drawerProps.title}`" :destroy-on-close="true" width="880px" draggable>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录名称" prop="userName">
            <el-input v-model="drawerProps.row!.userName" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="branchCode">
            <el-input v-model="drawerProps.row!.branchCode" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="userRoleId">
            <el-select v-model="drawerProps.row!.userRoleId" placeholder="请选择" class="check-select">
              <template v-for="item in userList" :key="item.id">
                <el-option :label="item.roleName" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属店铺" prop="userBranchId">
            <el-select v-model="drawerProps.row!.userBranchId" placeholder="请选择" class="check-select">
              <template v-for="item in branchList" :key="item.id">
                <el-option :label="item.branchName" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="userTel">
            <el-input v-model="drawerProps.row!.userTel" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">关闭</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import { getAllUser, getAllBranch, getAllRole } from "@/api/modules/set";

const rules = reactive({
  userCode: [{ required: true, message: "必填项不能为空" }],
  userName: [{ required: true, message: "必填项不能为空" }],
  userTel: [{ required: true, message: "必填项不能为空" }],
  userAccount: [{ required: true, message: "必填项不能为空" }],
  userPassword: [{ required: true, message: "必填项不能为空" }],
  userRoleId: [{ required: true, message: "必填项不能为空" }],
  userBranchId: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  time?: Date | null;
  title: string;
  isView: boolean;
  row: Partial<User.ResUser>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  time: null,
  isView: false,
  title: "",
  row: {}
});
const userList = ref([]);
const branchList = ref([]);
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps & any) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  const { data } = await getAllRole({});
  userList.value = data;
  userListMap();
};
const userListMap = async () => {
  const { data } = await getAllBranch({});
  branchList.value = data;
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
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

<style lang="scss" scoped>
.check-select {
  :deep(.el-input__wrapper) {
    width: 300px;
  }
}
</style>
