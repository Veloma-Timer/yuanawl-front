<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :show-close="false">
    <template #header>
      <Header :title="`${drawerProps.title}销售列表`" class="header" style="transform: translateY(7px)"></Header>
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
      <el-form-item label="账户" prop="id">
        <el-select v-model="drawerProps.row!.id" placeholder="请选择账户" filterable>
          <el-option v-for="item in accountList" :key="item.id" :label="item.accountTitle" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="出售人姓名" prop="salePeopleId">
        <el-select v-model="drawerProps.row!.salePeopleId" placeholder="请选择出售人" filterable>
          <el-option v-for="item in transCatUploadedMap" :key="item.id" :label="item.userName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="出售时间" prop="saleTime">
        <el-date-picker
          v-model="drawerProps.row!.saleTime"
          format="YYYY-MM-DD hh:mm:ss"
          value-format="YYYY-MM-DD hh:mm:ss"
          type="datetime"
          placeholder="请选择出售时间"
        />
      </el-form-item>
      <el-form-item label="出售金额" prop="salePrice">
        <el-input-number v-model="drawerProps.row!.salePrice" placeholder="请输入出售金额" clearable :controls="false" />
      </el-form-item>
      <el-form-item label="出售平台" prop="salePlatformId">
        <el-select v-model="drawerProps.row!.salePlatformId" placeholder="请选择" filterable>
          <el-option v-for="item in handleMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="买家手机号" prop="buyerTel">
        <el-input v-model="drawerProps.row!.buyerTel" :maxlength="11" placeholder="请输入买家手机号" clearable />
      </el-form-item>
      <el-form-item label="销售备注" prop="salesRemark">
        <el-input
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          v-model="drawerProps.row!.salesRemark"
          placeholder="请输入销售备注"
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
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getUserAll } from "@/api/modules/user";
import { getPublishList } from "@/api/modules/commodity";
import { sellKeyMap } from "@/api/modules/dictionary";

const rules = reactive({
  salePeopleId: [{ required: true, message: "必填项不能为空" }],
  id: [{ required: true, message: "必填项不能为空" }],
  salesRemark: [{ required: true, message: "必填项不能为空" }],
  salePrice: [{ required: true, message: "必填项不能为空" }],
  salePlatform: [{ required: true, message: "必填项不能为空" }],
  saleTime: [{ required: true, message: "必填项不能为空" }],
  buyerTel: [{ required: true, message: "必填项不能为空" }]
});
const edit = () => {
  drawerProps.value.isView = false;
};
interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Commodity.Sales>;
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
// 上架
let transCatUploadedMap: object[] = reactive([]);
let accountList: object[] = reactive([]);
let handleMap: object[] = reactive([]);
const publishMap = () => {
  sellKeyMap().then(res => {
    const {
      data: {
        data: { publishPlatform = [] }
      }
    } = res;
    handleMap = publishPlatform;
  });
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
// 获取出售平台名称
const getPlatformName = value => {
  const label = handleMap.find(item => item.value === value) || {};
  drawerProps.value.row = {
    ...drawerProps.value.row,
    salePlatform: label.label
  };
};
const setAllList = async () => {
  const { data = [] } = await getUserAll();
  const {
    data: { list = [] }
  } = await getPublishList({});
  transCatUploadedMap = data;
  accountList = list;
  await publishMap();
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
