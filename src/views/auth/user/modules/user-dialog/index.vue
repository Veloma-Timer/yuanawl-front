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
          <el-form-item label="员工工号" prop="userCode">
            <el-input v-model="drawerProps.row!.userCode" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录账号" prop="userAccount">
            <el-input v-model="drawerProps.row!.userAccount" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="drawerProps.row!.userName" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="userRoleId">
            <el-select v-model="drawerProps.row!.userRoleId" placeholder="请选择" class="check-select" filterable>
              <template v-for="item in userList" :key="item.id">
                <el-option :label="item.roleName" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属店铺" prop="userBranchId">
            <el-select v-model="drawerProps.row!.userBranchId" placeholder="请选择" class="check-select" filterable>
              <template v-for="item in branchList" :key="item.id">
                <el-option :label="item.branchName" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="userTel">
            <el-input
              v-model="drawerProps.row!.userTel"
              :maxlength="11"
              placeholder="请输入"
              clearable
              class="order-input"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理员" prop="isAdmin">
            <el-radio-group v-model="drawerProps.row!.isAdmin" class="ml-4">
              <el-radio label="1" size="large">是</el-radio>
              <el-radio label="0" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在职状态" prop="jobStatus ">
            <el-radio-group v-model="drawerProps.row!.jobStatus " class="ml-4">
              <el-radio label="在职" size="large">在职</el-radio>
              <el-radio label="离职" size="large">离职</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="drawerProps.row!.isAdmin === '0'">
          <el-form-item label="所在部门" prop="setId">
            <el-select v-model="drawerProps.row!.setId" placeholder="请选择所在部门" class="check-select" filterable>
              <template v-for="item in setIdList" :key="item.value">
                <el-option :label="item.label" :value="item.value" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="form-password">默认密码是123456</span>
      <el-button @click="drawerVisible = false">关闭</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import { getAllBranch, getAllRole } from "@/api/modules/set";
import { getGroupListMap } from "@/api/modules/user";
import md5 from "js-md5";
import { checkPhoneNumber } from "@/utils/eleValidate";
const rules = reactive({
  userCode: [{ required: true, message: "必填项不能为空" }],
  userName: [{ required: true, message: "必填项不能为空" }],
  userTel: [
    { required: true, message: "必填项不能为空" },
    { required: true, validator: checkPhoneNumber, trigger: "blur" }
  ],
  userAccount: [{ required: true, message: "必填项不能为空" }],
  userPassword: [{ required: true, message: "必填项不能为空" }],
  userRoleId: [{ required: true, message: "必填项不能为空" }],
  userBranchId: [{ required: true, message: "必填项不能为空" }],
  setId: [{ required: true, message: "必填项不能为空" }],
  isAdmin: [{ required: true, message: "必填项不能为空" }]
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

type RoleObj = { roleName: string; id: number };
const userList = ref<RoleObj[]>([]);
type BranchObj = { branchName: string; id: number };
type setObj = { label: string; value: number };
const branchList = ref<BranchObj[]>([]);
const setIdList = ref<setObj[]>([]);

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps & any) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  const { data } = await getAllRole({});
  userList.value = data;
  await userListMap();
  await setListMap();
};
const userListMap = async () => {
  const { data } = await getAllBranch({});
  branchList.value = data;
};
const setListMap = async () => {
  const { data } = await getGroupListMap({ key: "set" });
  setIdList.value = data.set || [];
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const params = {
        ...drawerProps.value.row,
        userPassword: md5("123456")
      };
      await drawerProps.value.api!(params);
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
.form-password {
  float: left;
  font-size: 12px;
  color: #666666;
}
</style>
