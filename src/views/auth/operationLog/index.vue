<template>
  <div class="table-box">
    <ProTable ref="proTable" title="操作日志" :columns="columns" :request-api="getTableList" :init-param="initParam"> </ProTable>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { User } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getOptLog } from "@/api/modules/set";
const proTable = ref<ProTableInstance>();
const initParam = reactive({ type: 1 });

const getTableList = (params: any) => {
  return getOptLog(params);
};

// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "日志编号", width: 100 },
  {
    prop: "username",
    label: "系统模块",
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row.username}</span>;
    }
  },
  {
    prop: "gender",
    label: "操作类型",
    // enum: getUserGender,
    render: scope => {
      return <span style={{ color: "#FFBA00" }}>{scope.row.gender}</span>;
    }
  },
  { prop: "idCard", label: "操作人员", search: { el: "input" } },
  { prop: "address", label: "所属店铺" },
  {
    prop: "status",
    label: "角色",
    // enum: getUserStatus,
    render: scope => {
      return <span>{scope.row.status}</span>;
    }
  },
  {
    prop: "createTime",
    label: "操作日期",
    width: 180
  },
  {
    prop: "status",
    label: "操作状态",
    // enum: getUserStatus,
    render: scope => {
      return <span>{scope.row.status === 1 ? "成功" : "失败"}</span>;
    }
  }
];
</script>
