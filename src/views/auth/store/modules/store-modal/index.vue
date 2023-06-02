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
          <el-form-item label="分店名称" prop="branchName">
            <el-input v-model="drawerProps.row!.branchName" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分店编号" prop="branchCode">
            <el-input v-model="drawerProps.row!.branchCode" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分店联系人" prop="branchContactId">
            <el-select v-model="drawerProps.row!.branchContactId" placeholder="请选择" class="check-select">
              <template v-for="item in userList" :key="item.id">
                <el-option :label="item.userName" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分店地址" prop="branchAddress">
            <el-input v-model="drawerProps.row!.branchAddress" placeholder="请输入" clearable class="order-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分店联系方式" prop="branchTel">
            <el-input v-model="drawerProps.row!.branchTel" placeholder="请输入" clearable class="order-input"></el-input>
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
import { Set } from "@/api/interface";
import { getAllUser } from "@/api/modules/set";

const rules = reactive({
  branchName: [{ required: true, message: "必填项不能为空" }],
  branchCode: [{ required: true, message: "必填项不能为空" }],
  branchContactId: [{ required: true, message: "必填项不能为空" }],
  branchAddress: [{ required: true, message: "必填项不能为空" }],
  branchTel: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  time?: Date | null;
  title: string;
  isView: boolean;
  row: Partial<Set.ResAddStore>;
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

type UserObj = { userName: string; id: Number };
const userList = ref<UserObj[]>([]);

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps & any) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  const { data } = await getAllUser({});
  userList.value = data;
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
