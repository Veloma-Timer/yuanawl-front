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
      <template #tableHeader="{ selectedListIds }">
        <div v-if="props?.isShowTableHeadeBtn">
          <el-button v-if="BUTTONS.add" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增</el-button>
          <el-button type="primary" :icon="Download" plain @click="batchAdd('下载')">下载模板</el-button>
          <el-button v-if="BUTTONS.import" type="primary" :icon="Upload" plain @click="batchAdd('导入')">导入Excel</el-button>
          <el-button v-if="BUTTONS.export" type="primary" :icon="Document" plain @click="onExport">导出Excel</el-button>
          <el-button type="danger" plain :icon="Delete" v-if="BUTTONS.del" @click="deleteAccount(selectedListIds)">
            批量删除
          </el-button>
        </div>
      </template>
      <template #accountRecyclerPrice="scope">
        {{ getFixed(scope.row.accountRecyclerPrice) || "--" }}
      </template>
      <template #accountTel="{ row }">
        <div class="flx-justify-between">
          <span>{{ row.status ? getPhone(row.accountTel) : setPhone(row.accountTel) }}</span>
          <span class="cursor-pointer" @click="onSetPhone(row)">
            <el-icon v-show="row.status"><View /></el-icon>
            <el-icon v-show="!row.status"><Hide /></el-icon>
          </span>
        </div>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" v-if="BUTTONS.view" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" v-if="BUTTONS.del" @click="deleteAccount(scope.row)">删除 </el-button>
        <el-button link @click="addOrder(scope.row)">创建工单</el-button>
      </template>
    </ProTable>
    <recoverDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import recoverDrawer from "@/views/commodity/recovery/modules/recoverDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, Download, Hide, Upload, View, Document } from "@element-plus/icons-vue";
import {
  addRecycle,
  deleteAccountBatch,
  deleteSummary,
  editRecycle,
  generateCode,
  getRecycleList,
  pointBury,
  recycleTemplate,
  recycleUpload,
  summaryExport
} from "@/api/modules/commodity";
import { getAllList } from "@/api/modules/accountClass";
import { Commodity } from "@/api/interface/commodity/commodity";
import { saveFile } from "@/utils/file";
import { getAllBranch, getAccountCodeAndId } from "@/api/modules/set";
import { getGroupListMap, getRecycleUsers } from "@/api/modules/user";
import { parseTime } from "@/utils/is";
import { useUserStore } from "@/stores/modules/user";
import { decryption } from "@/utils/AESUtil";
import { getPhone, setPhone, shortcuts } from "@/utils";
import { useRouter } from "vue-router";
import deepcopy from "deepcopy";

const router = useRouter();
const userStore = useUserStore();
const token = userStore.token; // 获取token
const obj = JSON.parse(decryption("token", token));
// const route = useRoute();
// 跳转详情页
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 创建工单
const addOrder = (row: Partial<Commodity.Sales>) => {
  const id = row.id;
  router.push({ name: "工单新增", query: { accId: id || "" } });
};

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
const { BUTTONS } = useAuthButtons();

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
const getTableList = async (params: any) => {
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return await getRecycleList(newParams);
};
const getFixed = (str: string) => {
  if (str) {
    return "￥" + parseFloat(str).toFixed(2);
  }
  return "--";
};
// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Commodity.Recovery>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "accountCode",
    label: "账号编码",
    fixed: "left",
    width: 160,
    enum: getAccountCodeAndId,
    search: {
      el: "select-v2",
      props: {
        filterable: true,
        "allow-create": true
      },
      slotName: true
    },
    fieldNames: { label: "accountCode", value: "accountCode" },
    render: ({ row }) => {
      const status = row.isWorkOrder === "1";
      return (
        <div class="cursor-pointer">
          <div class="cursor-pointer">
            {status ? (
              <router-link to={{ name: "工单新增", query: { id: row?.orderId || "" } }}>
                <span class="red">{row.accountCode}</span>
              </router-link>
            ) : (
              <span>{row.accountCode}</span>
            )}
          </div>
        </div>
      );
    }
  },
  { prop: "recycleOrder", label: "回收订单号", width: 200, search: { el: "input" } },
  {
    prop: "storeId",
    label: "回收店铺",
    width: 120,
    search: { el: "select" },
    enum: async () => {
      const {
        data: { recycleShop }
      } = await getGroupListMap({ key: "recycleShop" });
      return { data: recycleShop };
    },
    fieldNames: { label: "label", value: "id" }
  },
  {
    prop: "groupingId",
    label: "分组",
    width: 120,
    search: { el: "select" },
    enum: async () => {
      const {
        data: { grouping }
      } = await getGroupListMap({ key: "grouping" });

      return { data: grouping };
    },
    fieldNames: { label: "label", value: "id" }
  },
  {
    prop: "qq",
    label: "QQ号",
    sortable: true,
    width: 160,
    search: {
      el: "input"
    }
  },
  {
    prop: "branchId",
    label: "所属门店",
    width: 160,
    enum: getAllBranch,
    search: { el: "select" },
    fieldNames: { label: "branchName", value: "id" }
  },
  {
    prop: "accountType",
    label: "游戏分类",
    width: 160,
    enum: getAllList,
    search: { el: "select" },
    fieldNames: { label: "typeName", value: "id" },
    render: ({ row }) => row.accountTypeNames
  },
  { prop: "accountPassword", label: "密码", width: 160 },
  {
    prop: "accountTel",
    label: "密保手机",
    width: 180,
    search: { el: "input" }
  },
  {
    prop: "isSave",
    label: "是否存档",
    sortable: true,
    width: 160,
    enum: [
      { label: "是", value: "1" },
      { label: "否", value: "0" }
    ],
    search: {
      el: "select",
      props: {
        filterable: true
      }
    }
  },
  {
    prop: "recycleMethod",
    label: "回收方式",
    width: 160
  },
  { prop: "campId", label: "营地号", width: 160, search: { el: "input" } },
  { prop: "phoneRemark", label: "手机卡备注", width: 160 },
  {
    prop: "email",
    label: "邮箱",
    width: 160,
    search: { el: "input" }
  },
  { prop: "emailSecret", label: "邮箱密保", width: 160 },
  {
    prop: "systemId",
    label: "系统",
    width: 160,
    search: { el: "select" },
    enum: [
      { label: "安卓QQ", value: 1 },
      { label: "苹果QQ", value: 2 },
      { label: "安卓微信", value: 3 },
      { label: "苹果微信", value: 4 }
    ]
  },
  { prop: "accountDesc", label: "账号描述", width: 160, search: { el: "input" } },
  {
    prop: "haveSecondary",
    label: "实名情况",
    width: 160,
    enum: [
      { label: "有", value: "1" },
      { label: "无", value: "0" }
    ]
  },
  {
    prop: "accountRecyclerPrice",
    label: "回收价",
    width: 160
  },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    width: 160,
    enum: getRecycleUsers,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "accountRecyclerTime",
    label: "回收日期",
    width: 160,
    render: scope => {
      return parseTime(scope.row?.accountRecyclerTime, "{y}-{m}-{d} {h}:{i}:{s}");
    }
  },
  { prop: "recycleRemark", label: "回收备注", width: 160, search: { el: "input" } },
  {
    prop: "timeSection",
    sortable: true,
    isShow: false,
    label: "时间区间",
    search: {
      el: "date-picker",
      props: { type: "daterange", unlinkPanels: true, shortcuts: shortcuts, valueFormat: "YYYY-MM-DD" }
    }
  },
  {
    prop: "operation",
    label: "操作",
    fixed: "right",
    width: 250
  }
];

// 删除用户信息
const deleteAccount = async (params: Commodity.Account | number[] | string[]) => {
  if (Array.isArray(params)) {
    await useHandleData(deleteAccountBatch, params, `批量删除账号`);
  } else {
    await useHandleData(deleteSummary, { id: [params.id] }, `确认是否删除该【${params.accountCode}】账号吗`);
  }
  proTable.value?.getTableList();
};

const onExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await summaryExport(obj);
  saveFile(data, "账号汇总导出");
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: `${title}回收列表模板`,
    status: title === "下载",
    tempApi: recycleTemplate,
    updateApi: recycleUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof recoverDrawer> | null>(null);
const openDrawer = async (title: string, row: Partial<Commodity.Recovery> = {}) => {
  const _row = deepcopy(row);
  // 当前时间
  const date = new Date();
  let time = "";
  if (title === "编辑") {
    _row.accountType = row.accountType?.map(item => Number(item));
    _row.accountCode = row.accountCode;
    _row.accountRecyclerTime = parseTime(row.accountRecyclerTime, "{y}-{m}-{d} {h}:{i}:{s}");
    _row.accountRecyclerId = Number(_row.accountRecyclerId);
    _row.branchId = Number(_row.branchId);
  } else {
    const { data } = await generateCode();
    _row.accountCode = data;
    time = parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}");
    _row.accountRecyclerTime = time;
    _row.accountRecyclerId = obj.user.id;
    _row.branchId = obj.user.userBranchId;
  }

  const params = {
    title,
    isView: title === "查看",
    status: title === "查看",
    row: _row,
    api: title === "新增" ? addRecycle : title === "编辑" ? editRecycle : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
const onSetPhone = (row: any) => {
  const params = {
    accountId: row.id,
    tel: row.accountTel
  };
  pointBury(params).finally(() => {
    row.status = !row.status;
  });
};

// 数据统计引用的本页面 需要隐藏部分
const props = withDefaults(
  defineProps<{
    isShowTableHeadeBtn?: boolean;
  }>(),
  {
    isShowTableHeadeBtn: true
  }
);
</script>
<style lang="scss">
.red {
  color: var(--el-color-error);
}
.green {
  color: var(--el-color-success);
}
</style>
