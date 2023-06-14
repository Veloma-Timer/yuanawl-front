<template>
  <div class="table-box">
    <ProTable ref="proTable" title="操作日志" :columns="columns" :request-api="getTableList" :init-param="initParam"> </ProTable>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getOptLog, getAllBranch, getAllRole, getAllUser } from "@/api/modules/set";
import { OPT_STATUS } from "@/public/constant";
import dayjs from "dayjs";
import { Set } from "@/api/interface";
const proTable = ref<ProTableInstance>();
const initParam = reactive({});

const getTableList = async (params: any) => {
  return getOptLog(params);
};

// 表格配置项
const columns: ColumnProps<Set.ResSalesList>[] = [
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
    search: { el: "input" },
    render: scope => {
      return <span style={{ color: "#FFBA00" }}>{scope.row.handleType || "--"}</span>;
    }
  },
  {
    prop: "handleUser",
    label: "操作人员",
    fieldNames: { label: "userName", value: "id" },
    render: scope => {
      return <span>{scope.row?.handleUser?.userName || "--"}</span>;
    }
  },
  {
    prop: "handleUserId",
    label: "操作人员",
    search: { el: "select", props: { filterable: true } },
    enum: getAllUser,
    isShow: false,
    fieldNames: { label: "userName", value: "id" }
  },
  {
    prop: "branch",
    label: "所属店铺",
    render: scope => {
      return <span>{scope.row?.branch?.branchName || "--"}</span>;
    }
  },
  {
    prop: "branchId",
    label: "所属店铺",
    enum: getAllBranch,
    search: { el: "select", props: { filterable: true } },
    isShow: false,
    fieldNames: { label: "branchName", value: "id" }
  },
  {
    prop: "handleRole",
    label: "角色",
    render: scope => {
      return <span>{scope.row?.handleRole?.roleName || "--"}</span>;
    }
  },
  {
    prop: "handleRoleId",
    label: "角色",
    enum: getAllRole,
    search: { el: "select", props: { filterable: true } },
    isShow: false,
    fieldNames: { label: "roleName", value: "id" }
  },
  {
    prop: "handleTime",
    label: "操作日期",
    width: 180,
    render: scope => {
      const time = scope.row?.handleTime;
      return <span>{dayjs(time).format("YYYY-MM-DD HH:mm:ss") || "--"}</span>;
    }
  },
  {
    prop: "handleDesc",
    label: "操作描述",
    render: scope => {
      return <span>{scope.row?.handleDesc || "--"}</span>;
    }
  },
  {
    prop: "handleStatus",
    label: "操作状态",
    render: scope => {
      return <span>{OPT_STATUS[scope.row.handleStatus as any] || "--"}</span>;
    }
  }
];
</script>
