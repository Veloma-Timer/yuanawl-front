<template>
  <div class="table-box">
    <ProTable ref="proTable" title="销售金额汇总" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('查看', scope.row)">查看</el-button>
      </template>
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-radio-group v-model="currentTimeSelect" size="large" @change="changeCityDate" class="city-radio">
          <template v-for="(item, index) in tabCityList" :key="index">
            <el-radio-button :label="item.title" />
          </template>
        </el-radio-group>
      </template>
    </ProTable>
    <RecoveryDrawer ref="ecoveryDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { User } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import RecoveryDrawer from "../recovery-modal/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getUserList, editUser, addUser } from "@/api/modules/user";
const proTable = ref<ProTableInstance>();
const initParam = reactive({ type: 1 });

const getTableList = (params: any) => {
  return getUserList(params);
};

// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "operation", label: "操作", fixed: "left", width: 130 },
  {
    prop: "username",
    label: "订单编号",
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row.gender}</span>;
    }
  },
  {
    prop: "username",
    label: "游戏分类",
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row.gender}</span>;
    }
  },
  {
    prop: "username",
    label: "收件姓名",
    search: { el: "input" },
    isShow: false,
    render: scope => {
      return <span>{scope.row.gender}</span>;
    }
  },
  { prop: "idCard", label: "标题" },
  {
    prop: "idCard",
    label: "回收金额",
    render: scope => {
      return <span>￥{scope.row.gender}</span>;
    }
  },
  // {
  //   prop: "idCard",
  //   label: "出售金额",
  //   render: scope => {
  //     return <span>￥{scope.row.gender}</span>;
  //   }
  // },
  {
    prop: "idCard",
    label: "回收人姓名",
    render: scope => {
      return <span>{scope.row.gender}</span>;
    }
  },
  {
    prop: "idCard",
    label: "卖方信息",
    search: { el: "input" },
    isShow: false,
    render: scope => {
      return <span>隔壁老王/{scope.row.gender}</span>;
    }
  },
  {
    prop: "createTime",
    label: "回收时间",
    width: 180,
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetime", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  },
  {
    prop: "idCard",
    label: "账号状态",
    render: scope => {
      return <span>{scope.row.gender === 1 ? "已售" : "未售"}</span>;
    }
  }
];

// 打开 drawer(新增、查看、编辑)
const ecoveryDrawerRef = ref<InstanceType<typeof RecoveryDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  ecoveryDrawerRef.value?.acceptParams(params);
};

const currentTimeSelect = ref("今日回收");
const tabCityList = ref([
  {
    title: "今日回收",
    key: "today"
  },
  {
    title: "历史回收",
    key: "history"
  }
]);
function changeCityDate(e: string | number | boolean) {
  currentTimeSelect.value = e as string;
}
</script>
