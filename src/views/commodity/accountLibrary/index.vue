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
        <el-button v-if="BUTTONS.export" type="primary" :icon="Document" plain @click="onExport">导出Excel</el-button>
        <el-button v-if="BUTTONS.del" type="danger" plain :icon="Delete" @click="deleteAccount(selectedListIds)">
          彻底删除
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <template #accountNumber="scope">
        {{ scope.row.accountNumber }}
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
      <!-- usernameHeader -->
      <!-- createTime -->
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" v-if="BUTTONS.view" @click="openDrawer('查看', scope.row)">查看</el-button>
        <!--<el-button type="danger" link :icon="Delete" v-if="BUTTONS.del" @click="deleteAccount(scope.row)">彻底删除 </el-button>-->
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import UserDrawer from "@/views/commodity/summary/modules/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Hide, View, Document, Delete } from "@element-plus/icons-vue";
import { getPublishUsers, getRecycleUsers, getSalesUsers } from "@/api/modules/user";
import {
  addSummary,
  delAccountComplete,
  editSummary,
  pointBury,
  summaryExport,
  getBaseAccountDel
} from "@/api/modules/commodity";
import { getAllList } from "@/api/modules/accountClass";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getPhone, parseTime, setPhone, shortcuts, getFixed } from "@/utils";
import { saveFile } from "@/utils/file";
import { getAllBaseAccountDel, getAllBranch } from "@/api/modules/set";
import deepcopy from "deepcopy";
import { sellKeyGrouping, sellKeyMap } from "@/api/modules/dictionary";
import { IOptions } from "@/typings";

const route = useRoute();
// 跳转详情页
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
const { BUTTONS } = useAuthButtons();
const typeList = ref<any[]>([]);
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
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getBaseAccountDel(newParams);
};

const getTypeList = async () => {
  const { data } = await getAllList();
  typeList.value = data;
};
getTypeList();

const getTypeListName = (ids: number[]) => {
  const idsNum = ids?.map(item => Number(item));
  const list = typeList.value;
  const names = idsNum?.map(item => {
    const obj = list.find(items => items.id === item);
    return obj?.typeName;
  });
  return names?.join();
};

const _publishPlatform = ref<IOptions>([]);

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Commodity.Account>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "accountCode",
    label: "账号编码",
    fixed: "left",
    sortable: true,
    width: 160,
    enum: getAllBaseAccountDel,
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
          {status ? (
            <router-link to={{ name: "工单新增", query: { id: row?.orderId || "" } }}>
              <span class="red">{row.accountCode}</span>
            </router-link>
          ) : (
            <span>{row.accountCode}</span>
          )}
        </div>
      );
    }
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
    prop: "accountStatus",
    label: "账号状态",
    width: 160,
    sortable: true,
    enum: [
      { label: "已售", value: 1 },
      { label: "未售", value: 0 }
    ],
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    render: ({ row }) => {
      const status = row.accountStatus === 0;
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "未售" : "已售"}</span>
        </div>
      );
    }
  },
  {
    prop: "isWorkOrder",
    label: "是否存在工单",
    width: 160,
    sortable: true,
    enum: [
      { label: "有", value: "1" },
      { label: "没有", value: "0" }
    ],
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    render: ({ row }) => {
      const status = row.isWorkOrder === "0";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-green" : "v-red"}></span>
          <span>{status ? "无" : "有"}</span>
        </div>
      );
    }
  },
  {
    prop: "isSales",
    label: "账户发布状态",
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    sortable: true,
    width: 160,
    enum: [
      { label: "未发布", value: "0" },
      { label: "已发布", value: "1" }
    ],
    render: ({ row }) => {
      const status = row.isPublish === "0";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "未发布" : "已发布"}</span>
        </div>
      );
    }
  },
  {
    prop: "groupingId",
    sortable: true,
    label: "回收组",
    width: 160,
    enum: async () => {
      const {
        data: { grouping = [] }
      } = await sellKeyGrouping();
      return { data: grouping };
    },
    fieldNames: { label: "label", value: "id" },
    search: {
      el: "select",
      props: {
        filterable: true
      }
    }
  },
  {
    prop: "accountType",
    label: "游戏分类",
    sortable: true,
    width: 160,
    enum: getAllList,
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    fieldNames: { label: "typeName", value: "id" },
    render: ({ row }) => {
      return getTypeListName(row.accountType);
    }
  },
  {
    prop: "salePeopleId",
    label: "出售人",
    sortable: true,
    width: 160,
    enum: getSalesUsers,
    search: {
      el: "select",
      props: {
        filterable: true
      }
    },
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "salePlatformId",
    width: 160,
    label: "出售渠道",
    enum: async () => {
      const {
        data: { publishPlatform = [] }
      } = await sellKeyMap();
      return { data: publishPlatform };
    },
    search: { el: "select" }
  },
  {
    prop: "saleTime",
    sortable: true,
    label: "出售时间",
    width: 160,
    render: scope => {
      return parseTime(scope.row!.saleTime, "{y}-{m}-{d} {h}:{i}");
    }
  },
  {
    prop: "noSaleResidenceTime",
    label: "滞留时间",
    sortable: true,
    width: 160,
    render: scope => {
      return (scope.row?.noSaleResidenceTime || 0) + "天";
    }
  },
  {
    prop: "salePrice",
    label: "出售金额",
    sortable: true,
    width: 160,
    search: { el: "input" },
    render: scope => {
      return <span>{getFixed(scope.row.salePrice) || "--"}</span>;
    }
  },
  {
    prop: "accountRecyclerPrice",
    label: "实际回收金额",
    width: 160,
    sortable: true,
    search: { el: "input" },
    render: scope => {
      return <span>{getFixed(scope.row.accountRecyclerPrice) || "--"}</span>;
    }
  },
  {
    prop: "branchId",
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
  // {
  //   prop: "accountNumber",
  //   sortable: true,
  //   label: "账号",
  //   width: 160
  // },
  {
    prop: "accountPassword",
    sortable: true,
    label: "密码",
    width: 160
  },
  {
    prop: "accountTel",
    sortable: true,
    label: "手机号",
    width: 160,
    search: { el: "input" }
  },
  {
    prop: "accountRemark",
    sortable: true,
    label: "备注",
    width: 160,
    search: { el: "input" }
  },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    width: 160,
    enum: getRecycleUsers,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  { prop: "recycleRemark", label: "回收备注", width: 160 },
  {
    prop: "accountPublisherId",
    label: "发布人",
    enum: getPublishUsers,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "publishPlatform",
    label: "发布渠道",
    minWidth: 150,
    enum: async () => {
      const {
        data: { publishPlatform = [] }
      } = await sellKeyMap();
      _publishPlatform.value = publishPlatform;
      return { data: publishPlatform };
    },
    search: {
      el: "select",
      props: {
        filterable: true,
        multiple: true
      }
    },
    render: ({ row }) => {
      return row.publishPlatform
        ?.map(id => {
          const platform = _publishPlatform.value.find((item: any) => {
            const value = item.value || item.id;
            return value == id;
          }) as any;
          return platform?.label || "--";
        })
        .join(" ");
    }
  },
  {
    prop: "accountPublisherTimer",
    label: "发布时间",
    minWidth: 150,
    render: ({ row }) => {
      return parseTime(row!.accountPublisherTimer, "{y}-{m}-{d} {h}:{i}:{s}");
    }
  },
  { prop: "recycleRemark", label: "发布备注", width: 160 },
  { prop: "salesRemark", label: "销售备注", width: 160 },
  {
    prop: "haveSecondary",
    label: "有无二次",
    sortable: true,
    width: 160,
    enum: [
      { label: "有", value: "1" },
      { label: "无", value: "0" }
    ],
    search: {
      el: "select",
      props: {
        filterable: true
      }
    }
  },
  {
    prop: "isSave",
    label: "资料是否存档",
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
  { prop: "accountDesc", sortable: true, label: "账号描述", width: 160, search: { el: "input" } },
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
  { prop: "operation", label: "操作", fixed: "right", width: 100 }
];

// 删除用户信息
const deleteAccount = async (ids: number[] | string[]) => {
  await useHandleData(delAccountComplete, ids, `彻底删除选中的账户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
// const batchDelete = async (id: string[]) => {
//   await useHandleData(deleteSummary, { id }, "导出用户信息");
//   proTable.value?.clearSelection();
//   proTable.value?.getTableList();
// };

const onExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await summaryExport(obj);
  saveFile(data, "账号汇总导出");
};

// 重置用户密码
// 切换用户状态
// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Commodity.Account> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addSummary : title === "查看" ? editSummary : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
onMounted(() => {
  setTimeout(() => {
    // 携带参数page跳转
    const { accountCode, accountType } = route.query;
    const type = accountType ? Number(accountType) : null;
    if (proTable.value) {
      proTable.value.searchParam.accountCode = accountCode;
      proTable.value.searchParam.accountType = type;
      proTable.value?.search();
    }
  }, 300);
});
const onSetPhone = (row: any) => {
  const params = {
    accountId: row.id,
    tel: row.accountTel
  };
  pointBury(params)
    .then(() => {})
    .finally(() => {
      row.status = !row.status;
    });
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
