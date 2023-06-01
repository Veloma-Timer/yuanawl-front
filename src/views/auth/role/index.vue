<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :pagination="false"
      :tool-button="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" plain @click="openDrawer('新增')">新建分类</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">编辑</el-button>
        <el-button type="primary" link @click="setRoleList(scope.row.powerId)">权限</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { Author, User } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/commodity/accountClass/modules/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, View } from "@element-plus/icons-vue";
import { getRoleLog, addRole, editRole } from "@/api/modules/role";
import { getIdPower } from "@/api/modules/power";
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getRoleLog(newParams);
};
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Author.RoleList>[] = [
  {
    prop: "roleName",
    label: "角色名"
  },
  {
    prop: "email",
    label: "员工工号",
    isShow: false,
    search: { el: "input" }
  },
  {
    prop: "email",
    label: "员工姓名",
    isShow: false,
    search: { el: "input" }
  },
  { prop: "roleDesc", label: "描述" },
  {
    prop: "disabled",
    label: "状态",
    render: scope => {
      return (
        <>
          <el-switch
            model-value={scope.row.disabled}
            active-text={scope.row.disabled ? "启用" : "禁用"}
            active-value={1}
            inactive-value={0}
            onClick={() => changeStatus(scope.row)}
          />
        </>
      );
    }
  },
  { prop: "operation", label: "操作", width: 200 }
];
// 按钮状态
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addRole : title === "编辑" ? editRole : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
// 修改状态
const changeStatus = (row: Author.RoleList) => {
  console.log(row);
};
// 查看角色权限
const setRoleList = (powerId: string) => {
  if (!powerId) return;
  getIdPower(powerId);
};
</script>
