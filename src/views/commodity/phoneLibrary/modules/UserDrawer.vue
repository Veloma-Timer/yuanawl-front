<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="660px" :show-close="false">
    <template #header>
      <Header :title="`${drawerProps.title}用户`" class="header" style="transform: translateY(7px)"></Header>
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
      <el-form-item label="开户人姓名" prop="username">
        <el-input v-model="drawerProps.row!.username" placeholder="请输入订单编号" clearable />
      </el-form-item>
      <el-form-item label="开户日期" prop="gender">
        <el-input v-model="drawerProps.row!.gender" placeholder="请输入游戏分类" clearable />
      </el-form-item>
      <el-form-item label="开户主号码（黑色卡册1)" prop="gender">
        <el-input v-model="drawerProps.row!.gender" placeholder="请输入游戏分类" clearable />
      </el-form-item>
      <el-form-item label="开户副卡①（黑色卡册1）" prop="gender">
        <el-input v-model="drawerProps.row!.gender" placeholder="请输入游戏分类" clearable />
      </el-form-item>
      <el-form-item label="开户副卡②" prop="gender">
        <el-input v-model="drawerProps.row!.gender" placeholder="请输入游戏分类" clearable />
      </el-form-item>
      <el-form-item label="开户副卡③" prop="gender">
        <el-input v-model="drawerProps.row!.gender" placeholder="请输入游戏分类" clearable />
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
import { User } from "@/api/interface";
import Header from "@/components/Header/index.vue";

const rules = reactive({
  avatar: [{ required: true, message: "请上传用户头像" }],
  photo: [{ required: true, message: "请上传用户照片" }],
  username: [{ required: true, message: "请输入用户姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  idCard: [{ required: true, message: "请输入身份证号" }],
  email: [{ required: true, message: "请输入邮箱" }],
  address: [{ required: true, message: "请输入居住地址" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResUserList>;
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
