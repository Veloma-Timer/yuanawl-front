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
        <el-button type="primary" v-if="BUTTONS.add" :icon="CirclePlus" plain @click="openDrawer('新增')">新建分类</el-button>
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
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/commodity/accountClass/modules/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, View } from "@element-plus/icons-vue";
import { addAccout, deleteAccout, getAccoutList, setAccout } from "@/api/modules/accountClass";
import { Commodity } from "@/api/interface/commodity/commodity";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import deepcopy from "deepcopy";
const { BUTTONS } = useAuthButtons();
// 跳转详情页
// const toDetail = () => {
//   router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`);
// };

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
  return getAccoutList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Commodity.accountClass>[] = [
  {
    prop: "typeCode",
    label: "分类编号",
    search: { el: "input" }
    // hasChildren: true
  },
  { prop: "typeName", label: "分类名称", search: { el: "input" } },
  // { prop: "email", label: "排序" },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

// 删除用户信息
const deleteAccount = async (params: Commodity.accountClass) => {
  await useHandleData(deleteAccout, { id: [params.id] }, `删除该【${params.typeName}】分类`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
// 重置用户密码
// 切换用户状态
// 导出用户列表
// 批量添加用户
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addAccout : title === "查看" ? setAccout : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
