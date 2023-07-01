<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="800px" :show-close="false">
    <template #header>
      <Header :title="`${drawerProps.title}用户`" class="header" style="transform: translateY(7px)"></Header>
      <el-button type="primary" @click="edit" class="edit-btn">
        <div>编辑</div>
      </el-button>
    </template>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="所属门店" prop="branchId">
        <el-select v-model="drawerProps.row!.branchId" placeholder="请选择" filterable>
          <el-option v-for="item in branchMap" :key="item.id" :label="item.branchName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="分组" prop="branchId">
        <el-select v-model="drawerProps.row!.branchId" placeholder="请选择" filterable>
          <el-option v-for="item in branchMap" :key="item.id" :label="item.branchName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号编号" prop="accountCode">
        <el-input v-model="drawerProps.row!.accountCode" disabled placeholder="请输入账号编号" clearable />
      </el-form-item>
      <el-form-item label="游戏分类" prop="accountType">
        <el-select v-model="drawerProps.row!.accountType" placeholder="请选择" filterable>
          <el-option v-for="item in accountTypeMap" :key="item.id" :label="item.typeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="accountTitle">
        <el-input v-model="drawerProps.row!.accountTitle" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="accountPassword">
        <el-input
          type="password"
          v-model="drawerProps.row!.accountPassword"
          placeholder="请输入密码"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="密保手机">
        <el-input v-model="drawerProps.row!.salePlatform" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机卡备注" prop="accountNumber">
        <el-input v-model="drawerProps.row!.accountNumber" placeholder="请输入账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="campId">
        <el-input v-model="drawerProps.row!.campId" placeholder="请输入账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱密保" prop="accountTel">
        <el-input v-model="drawerProps.row!.accountTel" placeholder="请输入手机号" clearable :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="系统">
        <el-select v-model="drawerProps.row!.haveSecondary" placeholder="请选择" filterable>
          <el-option v-for="item in systemMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号描述" prop="accountDesc">
        <el-input v-model="drawerProps.row!.accountDesc" placeholder="请输入账号描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="营地号" prop="accountDesc">
        <el-input v-model="drawerProps.row!.accountDesc" placeholder="请输入账号描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="实名情况" prop="isSave">
        <el-select v-model="drawerProps.row!.isSave" placeholder="请选择" filterable>
          <el-option v-for="item in haveSecondaryMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="回收订单号" prop="transCatUid">
        <el-input v-model="drawerProps.row!.transCatUid" placeholder="请输入交易猫UID" clearable></el-input>
      </el-form-item>
      <el-form-item label="回收店铺" prop="transCatUploaded">
        <el-select v-model="drawerProps.row!.transCatUploaded" placeholder="请选择" filterable>
          <el-option v-for="item in transCatUploadedMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="回收时间" prop="accountRecyclerTime">
        <el-date-picker
          v-model="drawerProps.row!.accountRecyclerTime"
          format="YYYY-MM-DD hh:mm:ss"
          value-format="YYYY-MM-DD hh:mm:ss"
          type="date"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="回收客服" prop="accountLevel">
        <el-input v-model="drawerProps.row!.accountLevel" placeholder="请输入账号等级" clearable></el-input>
      </el-form-item>
      <el-form-item label="回收备注" prop="accountLevel">
        <el-input
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          v-model="drawerProps.row!.accountDesc"
          placeholder="请输入账号描述"
          clearable
        ></el-input>
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
import Header from "@/components/Header/index.vue";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getAllList } from "@/api/modules/accountClass";
import { getUserAll } from "@/api/modules/user";
import { getAllBranch } from "@/api/modules/set";
const rules = reactive({
  accountCode: [{ required: true, message: "必填项不能为空" }],
  accountType: [{ required: true, message: "必填项不能为空" }],
  accountTitle: [{ required: true, message: "必填项不能为空" }],
  accountRecycler: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerTime: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerPrice: [{ required: true, message: "必填项不能为空" }],
  accountPublisherId: [{ required: true, message: "必填项不能为空" }],
  accountPublisherTimer: [{ required: true, message: "必填项不能为空" }],
  salePlatform: [{ required: true, message: "必填项不能为空" }],
  saleTime: [{ required: true, message: "必填项不能为空" }],
  salePrice: [{ required: true, message: "必填项不能为空" }],
  accountNumber: [{ required: true, message: "必填项不能为空" }],
  accountPassword: [{ required: true, message: "必填项不能为空" }],
  accountTel: [{ required: true, message: "必填项不能为空" }],
  accountRemark: [{ required: true, message: "必填项不能为空" }],
  campId: [{ required: true, message: "必填项不能为空" }],
  haveSecondary: [{ required: true, message: "必填项不能为空" }],
  isSave: [{ required: true, message: "必填项不能为空" }],
  accountDesc: [{ required: true, message: "必填项不能为空" }],
  accountStatus: [{ required: true, message: "必填项不能为空" }],
  netUpload: [{ required: true, message: "必填项不能为空" }],
  transCatUploaded: [{ required: true, message: "必填项不能为空" }],
  transCatUid: [{ required: true, message: "必填项不能为空" }],
  accountLevel: [{ required: true, message: "必填项不能为空" }],
  accountPrice: [{ required: true, message: "必填项不能为空" }],
  userCompensationPrice: [{ required: true, message: "必填项不能为空" }],
  branchId: [{ required: true, message: "必填项不能为空" }],
  platformCompensationPrice: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerId: [{ required: true, message: "必填项不能为空" }],
  salePeopleId: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Commodity.Account>;
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
    console.log(valid);
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
// 账户分类
// 二次
const haveSecondaryMap = [
  { label: "有", value: "1" },
  { label: "无", value: "0" }
];
const systemMap = [
  { label: "安卓QQ", value: "1" },
  { label: "苹果QQ", value: "2" },
  { label: "安卓微信", value: "3" },
  { label: "苹果微信", value: "4" }
];
// 上架
const transCatUploadedMap = [
  { label: "已上架", value: "1" },
  { label: "未上架", value: "0" }
];
// 存档
let accountTypeMap: unknown = [];
let branchMap: unknown = [];
const setAllList = async () => {
  const res = await getAllList();
  const reloads = await getUserAll();
  const { data } = await getAllBranch({});
  accountTypeMap = res.data;
  branchMap = data;
};
setAllList();
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
.order-input,
.el-input {
  width: 400px !important;
}
</style>
