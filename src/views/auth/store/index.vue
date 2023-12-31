<template>
  <div class="table-box">
    <ProTable ref="proTable" title="门店管理" :columns="columns" :request-api="getTableList" :init-param="initParam">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增门店')" v-if="BUTTONS.add">新增门店</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="openDrawer('编辑', scope.row)" v-if="BUTTONS.edit" :icon="View">编辑</el-button>
        <el-button type="primary" link @click="deleteAccount(scope.row)" v-if="BUTTONS.del" :icon="Delete">删除</el-button>
      </template>
    </ProTable>
    <StoreModal ref="storeModalRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { Set } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import StoreModal from "./modules/store-modal/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getAllBranchPage, addBranch, delBranch, editBranch } from "@/api/modules/set";
import { useHandleData } from "@/hooks/useHandleData";
import { CirclePlus, View, Delete } from "@element-plus/icons-vue";
import { useAuthButtons } from "@/hooks/useAuthButtons";
const proTable = ref<ProTableInstance>();
const initParam = reactive({});
const { BUTTONS } = useAuthButtons();

const getTableList = (params: any) => {
  return getAllBranchPage(params);
};

// 表格配置项
const columns: ColumnProps<Set.ResAddStore>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "operation", label: "操作", fixed: "right", width: 180 },
  {
    prop: "branchCode",
    label: "门店编码",
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row.branchCode || "--"}</span>;
    }
  },
  {
    prop: "branchName",
    label: "门店名称",
    search: { el: "input" },
    render: scope => {
      return <span>{scope.row.branchName || "--"}</span>;
    }
  },
  {
    prop: "branchAddress",
    label: "门店负责人",
    render: ({ row }) => row.branchContact?.userName
  },
  {
    prop: "branchAddress",
    label: "门店地址"
  },
  {
    prop: "branchTel",
    label: "联系电话"
  }
];

// 打开 drawer(新增、查看、编辑)
const storeModalRef = ref<InstanceType<typeof StoreModal> | null>(null);
const openDrawer = (title: string, row: Partial<Set.ResAddStore> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增门店" ? addBranch : title === "编辑" ? editBranch : undefined,
    getTableList: proTable.value?.getTableList
  };
  storeModalRef.value?.acceptParams(params);
};

// 删除用户信息
const deleteAccount = async (params: any) => {
  await useHandleData(delBranch, { id: params.id }, `删除【${params.branchName}】门店`);
  proTable.value?.getTableList();
};
</script>
