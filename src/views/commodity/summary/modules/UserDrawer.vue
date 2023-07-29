<template>
  <el-dialog v-model="drawerVisible" :title="`${drawerProps.title}账号`" width="800px">
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
        <el-select v-model="drawerProps.row!.branchId" disabled placeholder="请选择所属门店" filterable>
          <el-option v-for="item in branchMap" :key="item.id" :label="item.branchName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="回收组" prop="groupingId">
        <el-select v-model="drawerProps.row!.groupingId" placeholder="请选择回收组" filterable @change="setGroupingId">
          <el-option v-for="item in customerMap" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号编码" prop="accountCode">
        <el-input v-model="drawerProps.row!.accountCode" disabled placeholder="请输入账号编码" clearable />
      </el-form-item>
      <el-form-item label="账号分类" prop="accountType">
        <el-select v-model="drawerProps.row!.accountType" placeholder="请选择" filterable multiple clearable>
          <el-option v-for="item in accountTypeMap" :key="item.id" :label="item.typeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="回收人姓名" prop="accountRecyclerId">
            <el-select v-model="drawerProps.row!.accountRecyclerId" placeholder="请选择" filterable>
              <el-option v-for="item in userMap" :key="item.id" :label="item.userName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="回收时间" prop="accountRecyclerTime">
            <el-date-picker
              v-model="drawerProps.row!.accountRecyclerTime"
              format="YYYY-MM-DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
              type="date"
              placeholder="请选择"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="回收价格" prop="accountRecyclerPrice">
            <el-input-number
              class="order-input"
              v-model="drawerProps.row!.accountRecyclerPrice"
              placeholder="请输入"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发布人姓名">
            <el-select v-model="drawerProps.row!.accountPublisherId" placeholder="请选择" filterable>
              <el-option v-for="item in userMap" :key="item.id" :label="item.userName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="drawerProps.row!.accountPublisherTimer"
              format="YYYY-MM-DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
              :disabled-date="options"
              type="date"
              placeholder="请选择"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8"></el-col>
        <el-col :span="8">
          <el-form-item label="出售人姓名">
            <el-select v-model="drawerProps.row!.salePeopleId" placeholder="请选择" filterable>
              <el-option v-for="item in userMap" :key="item.id" :label="item.userName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出售时间">
            <el-date-picker
              v-model="drawerProps.row!.saleTime"
              type="date"
              format="YYYY-MM-DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
              :disabled-date="saleOptions"
              placeholder="请选择"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出售价格">
            <el-input-number
              class="order-input"
              v-model="drawerProps.row!.salePrice"
              placeholder="请输入"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="回收方式" prop="isSave">
        <el-select v-model="drawerProps.row!.isSave" placeholder="请选择" filterable>
          <el-option v-for="item in methodsMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="出售平台">
        <el-select v-model="drawerProps.row!.salePlatform" placeholder="请选择" filterable>
          <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="营地号" prop="campId">
        <el-input v-model="drawerProps.row!.campId" placeholder="请输入账号" clearable></el-input>
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
      <el-form-item label="账号实付金额" prop="accountPrice">
        <el-input-number
          class="order-input"
          v-model="drawerProps.row!.accountPrice"
          placeholder="请输入账号实付金额"
          clearable
          :maxlength="11"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="用户赔付金额">
        <el-input-number
          class="order-input"
          v-model="drawerProps.row!.userCompensationPrice"
          placeholder="请输入用户赔付金额"
          clearable
          :maxlength="11"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="平台赔付金额">
        <el-input-number
          class="order-input"
          v-model="drawerProps.row!.platformCompensationPrice"
          placeholder="请输入平台赔付金额"
          clearable
        ></el-input-number>
      </el-form-item>
      <el-form-item label="绑定手机号" prop="accountTel">
        <el-input v-model="drawerProps.row!.accountTel" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号备注">
        <el-input
          v-model="drawerProps.row!.accountRemark"
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          placeholder="请输入备注"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="有无二次" prop="haveSecondary">
        <el-select v-model="drawerProps.row!.haveSecondary" placeholder="请选择" filterable>
          <el-option v-for="item in haveSecondaryMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="回收门店" prop="storeId">
        <el-select v-model="drawerProps.row!.storeId" placeholder="请选择" filterable>
          <el-option v-for="item in stores" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="资料是否存档" prop="isSave">
        <el-select v-model="drawerProps.row!.isSave" placeholder="请选择" filterable>
          <el-option v-for="item in isSaveMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号描述" prop="accountDesc">
        <el-input
          v-model="drawerProps.row!.accountDesc"
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          placeholder="请输入账号描述"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="网站上架">
        <el-select v-model="drawerProps.row!.transCatUploaded" placeholder="请选择" filterable>
          <el-option v-for="item in transCatUploadedMap" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="交易猫UID">
        <el-input v-model="drawerProps.row!.transCatUid" placeholder="请输入交易猫UID" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号等级" prop="accountLevel">
        <el-input v-model="drawerProps.row!.accountLevel" placeholder="请输入账号等级" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getAllList } from "@/api/modules/accountClass";
import { getGroupListMap, getUserAll } from "@/api/modules/user";
import { generateCode, typeCode } from "@/api/modules/commodity";
import { recycleShop, sellKeyMap } from "@/api/modules/dictionary";
import { checkPhoneNumber } from "@/utils/eleValidate";
import { decryption } from "@/utils/AESUtil";
import { useUserStore } from "@/stores/modules/user";
import { getAllBranch } from "@/api/modules/set";

const validatePass = (rule: any, value: any, callback: any) => {
  const params = {
    type: "accountCode",
    value
  };
  if (value) {
    typeCode(params).then(res => {
      const { data } = res;
      if (data === "0") {
        return callback(new Error("该编号已存在"));
      } else {
        return callback();
      }
    });
  }
};
const rules = reactive({
  accountCode: [
    { required: true, message: "必填项不能为空" },
    { validator: validatePass, trigger: "blur" }
  ],
  accountType: [{ required: true, message: "必填项不能为空" }],
  storeId: [{ required: true, message: "必填项不能为空" }],
  accountTitle: [{ required: true, message: "必填项不能为空" }],
  accountRecycler: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerTime: [{ required: true, message: "必填项不能为空" }],
  accountRecyclerPrice: [{ required: true, message: "必填项不能为空" }],
  accountPublisherId: [{ required: true, message: "必填项不能为空" }],
  accountPublisherTimer: [{ required: true, message: "必填项不能为空" }],
  salePlatform: [{ required: true, message: "必填项不能为空" }],
  saleTime: [{ required: true, message: "必填项不能为空" }],
  salePrice: [{ required: true, message: "必填项不能为空" }],
  //  accountNumber: [{ required: true, message: "必填项不能为空" }],
  accountPassword: [{ required: true, message: "必填项不能为空" }],
  accountTel: [
    { required: true, message: "必填项不能为空" },
    { validator: checkPhoneNumber, trigger: "blur" }
  ],
  accountRemark: [{ required: true, message: "必填项不能为空" }],
  campId: [
    { required: true, message: "必填项不能为空" },
    { validator: validatePass, trigger: "blur" }
  ],
  haveSecondary: [{ required: true, message: "必填项不能为空" }],
  isSave: [{ required: true, message: "必填项不能为空" }],
  // accountDesc: [{ required: true, message: "必填项不能为空" }],
  accountStatus: [{ required: true, message: "必填项不能为空" }],
  netUpload: [{ required: true, message: "必填项不能为空" }],
  transCatUploaded: [{ required: true, message: "必填项不能为空" }],
  transCatUid: [
    { required: true, message: "必填项不能为空" },
    { validator: validatePass, trigger: "blur" }
  ],
  // accountLevel: [{ required: true, message: "必填项不能为空" }],
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

let customerMap: Array<any> = [];

const options = date => {
  const accountRecyclerTime = drawerProps.value.row.accountRecyclerTime;
  const currentDate = new Date(accountRecyclerTime);
  currentDate.setHours(0, 0, 0, 0);
  return date.getTime() < currentDate.getTime();
};
const saleOptions = date => {
  const accountPublisherTimer = drawerProps.value.row.accountPublisherTimer;
  const currentDate = new Date(accountPublisherTimer);
  currentDate.setHours(0, 0, 0, 0);
  return date.getTime() < currentDate.getTime();
};
const drawerVisible = ref(false);
// const validateAge = (rule, value, callback) => {
//   console.log(rule, value, callback);
// };
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

const setGroupingId = (id: string) => {
  generateCode(id).then(res => {
    const { data } = res;
    drawerProps.value.row.accountCode = data;
  });
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
      const res = await drawerProps.value.api!(drawerProps.value.row);
      if (res.success) {
        ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
      }
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
// 上架
const transCatUploadedMap = [
  { label: "已上架", value: "1" },
  { label: "未上架", value: "0" }
];
// 存档
const isSaveMap = [
  { label: "是", value: "1" },
  { label: "否", value: "0" }
];
// 回收方式
const methodsMap = [
  { label: "自主压资料", value: "1" },
  { label: "买家已投保", value: "0" }
];
let accountTypeMap: unknown = [];
let userMap: unknown = [];
let stores: unknown = [];

const branchMap = ref([]);
let platformList: unknown = [];
const publishMap = () => {
  recycleShop().then(res => {
    const {
      data: { recycleShop = [] }
    } = res;
    stores = recycleShop;
  });
};

const userStore = useUserStore();
const token = userStore.token; // 获取token

const setAllList = async () => {
  const res = await getAllList();
  const reloads = await getUserAll();
  let {
    data: { publishPlatform = [] }
  } = await sellKeyMap();
  const { data } = await getGroupListMap({ key: "grouping" });
  customerMap = data.grouping;
  platformList = publishPlatform;
  drawerProps.value.row.groupingId = data.grouping[0].id;
  setGroupingId(data.grouping[0].id);
  accountTypeMap = res.data;
  userMap = reloads.data;
  await publishMap();
  const { data: branchList } = await getAllBranch({});
  branchMap.value = branchList;
  const obj = JSON.parse(decryption("token", token));
  drawerProps.value.row.branchId = obj.user.userBranchId;
};

watch(drawerVisible, dv => dv && setAllList());

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

.order-input {
  width: 220px !important;
}
</style>
