<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :show-close="false">
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
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="所属门店" prop="branchId">
        <el-select v-model="drawerProps.row!.branchId" :disabled="drawerProps.status" placeholder="请选择所属门店" filterable>
          <el-option v-for="item in branchMap" :key="item.id" :label="item.branchName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号标题" prop="accountTitle">
        <el-input v-model="drawerProps.row!.accountTitle" :disabled="drawerProps.isView" placeholder="请输入账号标题" clearable />
      </el-form-item>
      <el-form-item label="账号编号" prop="accountCode">
        <el-input v-model="drawerProps.row!.accountCode" :disabled="drawerProps.isView" placeholder="请输入账号编号" clearable />
      </el-form-item>
      <el-form-item label="账号分类" prop="accountType">
        <el-select v-model="drawerProps.row!.accountType" :disabled="drawerProps.isView" placeholder="请选择账号分类" filterable>
          <el-option v-for="item in accountTypeMap" :key="item.id" :label="item.typeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="accountNumber">
        <el-input v-model="drawerProps.row!.accountNumber" placeholder="请输入账号" clearable :disabled="drawerProps.isView" />
      </el-form-item>
      <el-form-item label="密码" prop="accountPassword">
        <el-input
          type="password"
          v-model="drawerProps.row!.accountPassword"
          placeholder="请输入密码"
          show-password
          clearable
          :disabled="drawerProps.isView"
        ></el-input>
      </el-form-item>
      <el-form-item label="密保手机" prop="accountTel">
        <el-input
          v-model="drawerProps.row!.accountTel"
          placeholder="请输入密保手机"
          :disabled="drawerProps.isView"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="手机卡备注" prop="phoneRemark">
        <el-input
          v-model="drawerProps.row!.phoneRemark"
          placeholder="请输入手机卡备注"
          :disabled="drawerProps.isView"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请输入邮箱" :disabled="drawerProps.isView" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱密保" prop="emailSecret">
        <el-input
          v-model="drawerProps.row!.emailSecret"
          placeholder="请输入邮箱密保"
          :disabled="drawerProps.isView"
          clearable
          :maxlength="11"
        ></el-input>
      </el-form-item>
      <el-form-item label="系统" prop="systemId">
        <el-select v-model="drawerProps.row!.systemId" :disabled="drawerProps.isView" placeholder="请选择" filterable>
          <el-option v-for="item in systemMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号描述" prop="accountRemark">
        <el-input
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          v-model="drawerProps.row!.accountRemark"
          :disabled="drawerProps.isView"
          placeholder="请输入账号描述"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="营地号" prop="campId">
        <el-input
          v-model="drawerProps.row!.campId"
          placeholder="请输入营地号"
          clearable
          :disabled="drawerProps.isView"
        ></el-input>
      </el-form-item>
      <el-form-item label="实名情况" prop="haveSecondary">
        <el-select v-model="drawerProps.row!.haveSecondary" :disabled="drawerProps.isView" placeholder="请选择" filterable>
          <el-option v-for="item in haveSecondaryMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="回收订单号" prop="recycleOrder">
        <el-input
          v-model="drawerProps.row!.recycleOrder"
          placeholder="请输入回收订单号"
          clearable
          :disabled="drawerProps.isView"
        ></el-input>
      </el-form-item>
      <el-form-item label="回收价格" prop="accountRecyclerPrice">
        <el-input
          v-model="drawerProps.row!.accountRecyclerPrice"
          placeholder="请输入回收价格"
          clearable
          :disabled="drawerProps.isView"
        ></el-input>
      </el-form-item>
      <el-form-item label="回收人" prop="accountRecyclerId">
        <el-select v-model="drawerProps.row!.accountRecyclerId" disabled placeholder="请选择回收人" filterable>
          <el-option v-for="item in transCatUploadedMap" :key="item.id" :label="item.userName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="回收店铺" prop="storeId">
        <el-select v-model="drawerProps.row!.storeId" placeholder="请选择回收店铺" filterable>
          <el-option v-for="item in customerMap" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="回收时间" prop="accountRecyclerTime">
        <el-date-picker
          disabled
          v-model="drawerProps.row!.accountRecyclerTime"
          format="YYYY-MM-DD hh:mm:ss"
          value-format="YYYY-MM-DD hh:mm:ss"
          type="datetime"
          placeholder="请选择回收时间"
        />
      </el-form-item>
      <el-form-item label="回收备注" prop="recycleRemark">
        <el-input
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          v-model="drawerProps.row!.recycleRemark"
          placeholder="请输入回收备注"
          :disabled="drawerProps.isView"
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
import { getGroupListMap, getUserAll } from "@/api/modules/user";
import { getAllBranch } from "@/api/modules/set";
const rules = reactive({
  accountTitle: [{ required: true, message: "必填项不能为空" }],
  branchId: [{ required: true, message: "必填项不能为空" }],
  accountCode: [{ required: true, message: "必填项不能为空" }],
  accountType: [{ required: true, message: "必填项不能为空" }],
  accountNumber: [{ required: true, message: "必填项不能为空" }],
  accountPassword: [{ required: true, message: "必填项不能为空" }],
  phoneRemark: [{ required: true, message: "必填项不能为空" }],
  email: [{ required: true, message: "必填项不能为空" }],
  emailSecret: [{ required: true, message: "必填项不能为空" }],
  systemId: [{ required: true, message: "必填项不能为空" }],
  accountRemark: [{ required: true, message: "必填项不能为空" }],
  campId: [{ required: true, message: "必填项不能为空" }],
  haveSecondary: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerPrice: [{ required: true, message: "必填项不能为空" }],
  recycleOrder: [{ required: true, message: "必填项不能为空" }],
  recycleRemark: [{ required: true, message: "必填项不能为空" }],
  storeId: [{ required: true, message: "必填项不能为空" }],
  accountTel: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerTime: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerId: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  status: boolean;
  row: Partial<Commodity.Recovery>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  status: true,
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
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}账户成功！` });
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
  { label: "安卓QQ", value: 1 },
  { label: "苹果QQ", value: 2 },
  { label: "安卓微信", value: 3 },
  { label: "苹果微信", value: 4 }
];
// 回收人
let transCatUploadedMap: unknown = [];
// 账号分类
let accountTypeMap: unknown = [];
// 门店
let branchMap: unknown = [];
// 回收店铺
let customerMap: Array<object> = [];
const setAllList = async () => {
  const res = await getAllList();
  const list = await getGroupListMap({ key: "recycleShop" });
  const reloads = await getUserAll();
  const { data } = await getAllBranch({});
  customerMap = list.data.recycleShop;
  transCatUploadedMap = reloads.data;
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
</style>
