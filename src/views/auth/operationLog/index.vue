<template>
  <div class="table-box">
    <ProTable ref="proTable" title="操作日志" :columns="columns" :request-api="getTableList" :init-param="initParam"> </ProTable>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getOptLog } from "@/api/modules/set";
const proTable = ref<ProTableInstance>();
const initParam = reactive({ type: 1 });

const getTableList = async (params: any) => {
  return getOptLog(params);
};

// 表格配置项
// const columns: ColumnProps<Set.ResSetList>[] = [
const columns: ColumnProps[] = [
  { type: "selection", fixed: "left", width: 80 },
  { type: "index", label: "日志编号", width: 100 },
  {
    prop: "sysModule",
    label: "系统模块",
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row.sysModule || ""}</span>;
    }
  },
  {
    prop: "handleType",
    label: "操作类型",
    render: scope => {
      return <span style={{ color: "#FFBA00" }}>{scope.row.handleType || "-"}</span>;
    }
  },
  {
    prop: "handleUser",
    label: "操作人员",
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row.handleUser || "-"}</span>;
    }
  },
  {
    prop: "branch",
    label: "所属店铺",
    render: scope => {
      return <span>{scope.row.branch || "-"}</span>;
    }
  },
  {
    prop: "handleRole",
    label: "角色",
    render: scope => {
      return <span>{scope.row.handleRole || "-"}</span>;
    }
  },
  {
    prop: "handleTime",
    label: "操作日期",
    width: 180,
    render: scope => {
      return <span>{scope.row.handleTime || "-"}</span>;
    }
  },
  {
    prop: "status",
    label: "操作状态",
    render: scope => {
      return <span>{scope.row.handleStatus || "-"}</span>;
    }
  }
];
</script>
