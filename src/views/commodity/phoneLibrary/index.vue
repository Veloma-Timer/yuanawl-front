<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" v-if="BUTTONS.add" :icon="CirclePlus" @click="openDrawer('新增')">新增手机号码库</el-button>
        <el-button type="primary" :icon="Download" plain @click="batchAdd('下载')">下载模板</el-button>
        <el-button type="primary" v-if="BUTTONS.import" :icon="Upload" plain @click="batchAdd('导入')">导入</el-button>
        <el-button v-if="BUTTONS.export" type="primary" :icon="Document" plain @click="onExport">导出Excel</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <!-- createTime -->
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" v-if="BUTTONS.edit" link :icon="View" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <!--        <el-button type="primary" v-if="BUTTONS.del" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>-->
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import UserDrawer from "@/views/commodity/phoneLibrary/modules/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Upload, View, Document, Download } from "@element-plus/icons-vue";
import {
  addPhone,
  deletePhone,
  getPhoneList,
  phoneExport,
  phoneTemplate,
  phoneUpload,
  setPhone
} from "@/api/modules/phoneLibrary";
import { parseTime } from "@/utils/is";
import { Commodity } from "@/api/interface/commodity/commodity";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { saveFile } from "@/utils/file";
const { BUTTONS } = useAuthButtons();
// const router = useRouter();
// 跳转详情页
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: Number(data.pageNum),
    pageSize: Number(data.pageSize)
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = deepcopy(params);
  // if (newParams.createTime[0] && newParams.createTime[1]) {
  //   newParams.openAccountTime = newParams.createTime.join(",");
  // }
  // delete newParams.createTime;
  return getPhoneList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Commodity.phoneLibrary>[] = [
  { prop: "openAccountName", label: "开户人姓名", search: { el: "input" } },
  // {
  //   prop: "createTime",
  //   label: "开户日期",
  //   render: scope => {
  //     return parseTime(scope.row.openAccountTime, "{y}-{m}-{d} {h}:{i}:{s}");
  //   },
  //   search: {
  //     el: "date-picker",
  //     span: 2,
  //     props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
  //     defaultValue: ["", ""]
  //   }
  // },
  {
    prop: "openAccountNumber",
    label: "开户主号码",
    search: { el: "input" }
  },
  {
    prop: "VNO",
    label: "运营商",
    search: { el: "input" }
  },
  {
    prop: "bindingQQTimes",
    label: "绑定QQ个数",
    search: { el: "input" }
  },
  {
    prop: "isBindingYuanshen",
    label: "是否绑定元神",
    enum: [
      { label: "是", value: "1" },
      { label: "否", value: "0" }
    ],
    search: { el: "select" }
  },
  {
    prop: "isBindingEmail",
    label: "是否绑定邮箱",
    enum: [
      { label: "是", value: "1" },
      { label: "否", value: "0" }
    ],
    search: { el: "select" }
  },
  {
    prop: "isBindingWechat",
    label: "是否绑定微信",
    enum: [
      { label: "是", value: "1" },
      { label: "否", value: "0" }
    ],
    search: { el: "select" }
  },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

// 删除用户信息
const deleteAccount = async (params: Commodity.phoneLibrary) => {
  await useHandleData(deletePhone, { id: [params.id] }, `删除【${params.openAccountName}】用户`);

  proTable.value?.getTableList();
};

// 批量删除用户信息
// 重置用户密码
// 切换用户状态
// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: `${title}手机号码库模板`,
    status: title === "下载",
    tempApi: phoneTemplate,
    updateApi: phoneUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
const onExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await phoneExport(obj);
  saveFile(data, "手机号码库导出");
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Commodity.phoneLibrary> = {}) => {
  const params = {
    title,
    isView: false,
    row: { ...row },
    api: title === "新增" ? addPhone : title === "编辑" ? setPhone : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
