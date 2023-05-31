<template>
  <div class="table-box">
    <ProTable ref="proTable" title="工单处理报表" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <div class="table-header">
          <el-radio-group v-model="currentTimeSelect" @change="changeSelectDate" class="date-radio">
            <template v-for="(item, index) in tabDateList" :key="index">
              <el-radio-button :label="item.title" />
            </template>
          </el-radio-group>
          <el-button type="primary" @click="exportData">导出</el-button>
        </div>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="openDrawer('查看', scope.row)" size="small">查看</el-button>
      </template>
    </ProTable>
    <OrderDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { SalesOrder } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import OrderDrawer from "../order-drawer/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getUserList, editUser, addUser, getUserGender } from "@/api/modules/user";
const proTable = ref<ProTableInstance>();
const initParam = reactive({ type: 1 });

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserList(newParams);
};

// 表格配置项
const columns: ColumnProps<SalesOrder.ResSalesList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "operation", label: "操作", fixed: "left", width: 180 },
  {
    prop: "username",
    label: "工单编号",
    search: { el: "input" },
    width: 180,
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  },
  {
    prop: "username",
    label: "订单编号",
    search: { el: "input" },
    width: 180,
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  },
  {
    prop: "username",
    label: "账号",
    search: { el: "input" },
    width: 180,
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  },
  {
    prop: "username",
    label: "实付金额",
    width: 180,
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  },
  {
    prop: "username",
    label: "上报人姓名",
    search: { el: "input" },
    width: 180,
    isShow: false,
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  },
  {
    prop: "username",
    label: "最新处理客服姓名",
    width: 180,
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  },
  {
    prop: "username",
    label: "客服姓名",
    width: 180,
    search: { el: "input" },
    isShow: false,
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  },
  {
    prop: "username",
    label: "最新处理结果",
    width: 180,
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  },
  {
    prop: "createTime",
    label: "提交工单时间",
    width: 180
  },
  {
    prop: "createTime",
    label: "最新处理时间",
    width: 180
  },
  {
    prop: "gender",
    label: "工单星级",
    enum: getUserGender,
    width: 180,
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "genderLabel", value: "genderValue" }
  },
  {
    prop: "gender",
    label: "状态",
    enum: getUserGender,
    width: 180,
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "genderLabel", value: "genderValue" }
  },
  {
    prop: "username",
    label: "审核人",
    width: 180,
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  },
  {
    prop: "username",
    label: "审核结果",
    width: 180,
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  }
];
const currentTimeSelect = ref("今日销售");
const tabDateList = ref([
  {
    title: "今日销售",
    key: "today"
  },
  {
    title: "历史销售",
    key: "history"
  }
]);
function changeSelectDate(e: string | number | boolean) {
  currentTimeSelect.value = e as string;
}

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof OrderDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<SalesOrder.ResSalesList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const exportData = () => {
  console.log("导出");
};
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: center;
  .date-radio {
    margin-right: 60px;
    transform: translateY(-7px);
  }
  .el-button {
    height: 31px;
  }
}
</style>
