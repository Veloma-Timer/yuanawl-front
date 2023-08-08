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
      <!-- Expand -->
      <template #publishPrice="scope">
        {{ getFixed(scope.row.publishPrice) || "--" }}
      </template>
      <template #publishPlatform="scope">
        {{ setEcho(scope.row.publishPlatform) }}
      </template>
      <!-- usernameHeader -->
      <!-- createTime -->
      <!-- 表格操作 -->
      <template #tableHeader>
        <div v-if="props?.isShowTableHeadeBtn">
          <el-button type="primary" :icon="Download" plain @click="batchAdd('下载')">下载模板</el-button>
          <el-button v-if="BUTTONS.import" type="primary" :icon="Upload" plain @click="batchAdd('导入')">导入Excel</el-button>
          <el-button v-if="BUTTONS.export" type="primary" :icon="Document" plain @click="onExport">导出Excel</el-button>
        </div>
      </template>
      <template #operation="scope">
        <el-button
          v-if="BUTTONS.add && scope.row.isSales === '0'"
          link
          type="primary"
          :icon="CirclePlus"
          @click="openDrawer('新增', scope.row)"
        >
          发布
        </el-button>
        <el-button type="primary" link :icon="View" v-if="BUTTONS.view" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button link @click="addOrder(scope.row)">创建工单</el-button>
        <!--        <el-button type="primary" link :icon="Delete" v-if="BUTTONS.del" @click="deleteAccount(scope.row)">删除</el-button>-->
      </template>
    </ProTable>
    <releaseDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ImportExcel from "@/views/commodity/components/ImportExcel/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import releaseDrawer from "@/views/commodity/release/modules/releaseDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Download, Upload, View, Document } from "@element-plus/icons-vue";
import { addPublish, editPublish, getPublishList, publishTemplate, publishUpload, summaryExport } from "@/api/modules/commodity";
import { Commodity } from "@/api/interface/commodity/commodity";
import { saveFile } from "@/utils/file";
import { getUserAll } from "@/api/modules/user";
import { parseTime, shortcuts } from "@/utils";
import { sellKeyMap } from "@/api/modules/dictionary";
import { useUserStore } from "@/stores/modules/user";
import { decryption } from "@/utils/AESUtil";
import deepcopy from "deepcopy";
import { useRouter } from "vue-router";
import { getAllBaseAccount, getAllBaseAccountDel } from "@/api/modules/set";
const userStore = useUserStore();
const token = userStore.token; // 获取token
const obj = JSON.parse(decryption("token", token));

const router = useRouter();

// const route = useRoute();
// 跳转详情页
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

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

// 创建工单
const addOrder = (row: Partial<Commodity.Sales>) => {
  const id = row.id;
  router.push({ name: "工单新增", query: { accId: id || "" } });
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = deepcopy(params);
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getPublishList(newParams);
};
const getFixed = (str: string) => {
  if (str) {
    return "￥" + parseFloat(str).toFixed(2);
  }
  return "--";
};

const _publishPlatform = ref<{ label: string; value: number; id: number }[]>([]);

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// 自定义渲染表头（使用tsx语法）
// 表格配置项
const columns: ColumnProps<Commodity.Release>[] = [
  { type: "selection", fixed: "left", width: 80 },
  {
    prop: "accountCode",
    label: "账号编码",
    width: 160,
    fixed: "left",
    enum: getAllBaseAccount,
    search: {
      el: "select-v2",
      props: {
        filterable: true
      },
      slotName: true
    },
    fieldNames: { label: "accountCode", value: "accountCode", name: "accountNumber" },
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
  {
    prop: "qq",
    label: "QQ号",
    sortable: true,
    width: 160,
    search: {
      el: "input"
    }
  },
  { prop: "publishPrice", label: "商品首次定价", minWidth: 150, search: { el: "input" } },
  { prop: "publishRemark", label: "发布备注", minWidth: 150, search: { el: "input" } },
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
    label: "密保手机",
    width: 180,
    search: { el: "input" }
  },
  { prop: "campId", label: "营地号", width: 160, search: { el: "input" } },
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
  {
    prop: "accountRecyclerPrice",
    label: "回收价格",
    width: 160,
    search: { el: "input" },
    render: ({ row }) => "¥" + row.accountRecyclerPrice || row.accountRecyclerPrice?.toFixed(2)
  },
  { prop: "recycleOrder", label: "回收订单号", width: 160, search: { el: "input" } },
  {
    prop: "accountRecyclerId",
    label: "回收人",
    width: 160,
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "accountRecyclerTime",
    label: "回收日期",
    width: 180,
    render: scope => {
      return parseTime(scope.row?.accountRecyclerTime, "{y}-{m}-{d} {h}:{i}");
    }
  },
  { prop: "recycleRemark", label: "回收备注", width: 160 },
  {
    prop: "accountPublisherId",
    label: "发布人",
    enum: getUserAll,
    search: { el: "select" },
    fieldNames: { label: "userName", value: "id" }
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
    search: { el: "select" },
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
    prop: "isPublish",
    label: "发布状态",
    search: { el: "select" },
    minWidth: 150,
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
    prop: "isSales",
    label: "销售状态",
    search: { el: "select" },
    width: 160,
    enum: [
      { label: "未售", value: "0" },
      { label: "已售", value: "1" }
    ],
    render: ({ row }) => {
      const status = row.isSales === "0";
      return (
        <div class="flex flex-row flx-center">
          <span class={status ? "v-red" : "v-green"}></span>
          <span>{status ? "未售" : "已售"}</span>
        </div>
      );
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
  {
    prop: "publishPlatform",
    label: "发布平台",
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
          const platform = _publishPlatform.value.find(item => {
            const value = item.value || item.id;
            return value == id;
          }) as any;
          return platform?.label || "--";
        })
        .join(" ");
    }
  },
  {
    prop: "rollBackTimer",
    label: "回滚时间",
    minWidth: 150,
    search: {
      el: "date-picker"
    },
    render: ({ row }) => {
      return parseTime(row!.rollBackTimer, "{y}-{m}-{d} {h}:{i}:{s}");
    }
  },
  {
    prop: "rollBackPlatform",
    label: "回滚平台",
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
      console.log(row.rollBackPlatform, "rollBackPlatform");
      return row.rollBackPlatform
        ?.map(id => {
          const platform = _publishPlatform.value.find(item => {
            const value = item.value || item.id;
            return value == id;
          }) as any;
          return platform?.label || "--";
        })
        .join(" ");
    }
  },
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
  { prop: "operation", label: "操作", fixed: "right", width: 300 }
];
const onExport = async () => {
  const obj = { ...proTable.value?.searchParam, ...proTable.value?.pageable };
  delete obj.total;
  const data = await summaryExport(obj);
  saveFile(data, "发布列表导出");
};
// 重置用户密码
// 切换用户状态
// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = (title: string) => {
  const params = {
    title: `${title}发布列表模板`,
    status: title === "下载",
    tempApi: publishTemplate,
    updateApi: publishUpload,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
// 发布平台
let handleMap: object[] = reactive([]);
const publishMap = () => {
  sellKeyMap().then(res => {
    const {
      data: { publishPlatform = [] }
    } = res;
    handleMap = publishPlatform;
  });
};
publishMap();
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof releaseDrawer> | null>(null);
// 回显数据
const setEcho = (arr: string[]) => {
  if (arr) {
    const list = arr?.map(item => Number(item));
    let names = [];
    const values = handleMap.filter(item => {
      return list.includes(item.value);
    });
    names = values?.map(item => item.label);
    return names.join(",");
  } else {
    return "--";
  }
};
const date = new Date();
const time = parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}");
const openDrawer = (title: string, row: Partial<Commodity.Release> = {}) => {
  const publishPlatform = row.publishPlatform?.map(item => Number(item));

  console.log(row.publishPlatform, publishPlatform);

  const params = {
    title,
    isView: title === "查看",
    row: {
      ...row,
      publishPlatform: publishPlatform,
      publishPrice: Number(row.publishPrice),
      accountPublisherTimer: time,
      accountPublisherId: obj.user.id
    },
    api: title === "新增" ? addPublish : title === "编辑" ? editPublish : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
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
.circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}

.v-red {
  @extend .circle;
  background-color: var(--el-color-error);
}

.v-green {
  @extend .circle;
  background-color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}

.green {
  color: var(--el-color-success);
}
</style>
