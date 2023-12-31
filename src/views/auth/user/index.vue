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
        <el-button type="primary" v-if="BUTTONS.add" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
        <el-button type="primary" :icon="Download" plain @click="batchAdd('下载')">下载用户模板</el-button>
        <el-button v-if="BUTTONS.import" type="primary" :icon="Upload" plain @click="batchAdd('导入')">导入Excel</el-button>
        <el-button v-if="BUTTONS.export" type="primary" :icon="Document" plain @click="onExport">导出Excel</el-button>
      </template>
      <template #userAccount="scope">
        <div class="cursor-pointer" @click="setRouter(scope.row)">{{ scope.row?.userAccount }}</div>
      </template>
      <template #userRoleId="scope">
        <div>{{ scope.row.userRole ? scope.row.userRole.roleName : "--" }}</div>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" v-if="BUTTONS.edit" link :icon="View" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" v-if="BUTTONS.del" link :icon="Delete" @click="_deleteUser(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { User } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import UserDrawer from "@/views/auth/user/modules/user-dialog/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Download, Upload, View, Document, Delete } from "@element-plus/icons-vue";
import {
  editUser,
  addUser,
  deleteUser,
  getUserListMap,
  getUserTemptable,
  getUserUpload,
  getUserExport
} from "@/api/modules/user";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { saveFile } from "@/utils/file";
import { useRouter } from "vue-router";
import deepcopy from "deepcopy";
import { useHandleData } from "@/hooks/useHandleData";
import { getAllBranch, getAllRole } from "@/api/modules/set";

const { BUTTONS } = useAuthButtons();

// 跳转详情页
const router = useRouter();
const setRouter = data => {
  router.push({
    path: "/homeStandby/index",
    query: {
      id: data.id
    }
  });
};
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

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
const onExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await getUserExport(obj);
  saveFile(data, "用户导出");
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserListMap(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<User.ResUser>[] = [
  { prop: "userAccount", label: "登录名", search: { el: "input" } },
  { prop: "userTel", label: "手机号码", search: { el: "input" } },
  { prop: "userCode", label: "工号", search: { el: "input" } },
  {
    prop: "userBranchId",
    label: "所属门店",
    sortable: true,
    width: 160,
    enum: getAllBranch,
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    fieldNames: { label: "branchName", value: "id" }
  },
  { prop: "userName", label: "姓名", search: { el: "input" } },
  {
    prop: "userRoleId",
    label: "角色",
    enum: getAllRole,
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "roleName", value: "id" }
  },
  {
    prop: "jobStatus",
    label: "在职状态",
    enum: [
      { label: "在职", value: "在职" },
      { label: "离职", value: "离职" }
    ],
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    render: ({ row }) => {
      const status = row.jobStatus === "离职";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "离职" : "在职"}</span>
        </div>
      );
    }
  },
  // { prop: "email", label: "状态" },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];

// 删除用户信息
const _deleteUser = async (params: User.ResUser) => {
  await useHandleData(deleteUser, params.id, `确认删除用户【${params.userName}】吗`);
  proTable.value?.getTableList();
};
// 重置用户密码
// 切换用户状态
// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: title === "下载" ? `${title}用户模板` : "用户导入",
    status: title === "下载",
    tempApi: getUserTemptable,
    updateApi: getUserUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUser> = {}) => {
  let jobName: string | undefined = "在职";
  if (title === "编辑") {
    jobName = row.jobStatus;
  }
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, jobStatus: jobName },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>

<style lang="scss">
.circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}
.red {
  color: var(--el-color-error);
}
.v-red {
  @extend .circle;
  background-color: var(--el-color-error);
}

.v-green {
  @extend .circle;
  background-color: var(--el-color-success);
}
</style>
