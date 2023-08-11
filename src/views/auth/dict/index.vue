<template>
  <div class="table-box flex flex-row h-full">
    <div class="w-4/12 mr-2">
      <ProTable
        ref="proTable"
        title="数据字典"
        :highlightCurrentRow="true"
        :columns="dictCols"
        :pagination="false"
        :tool-button="false"
        :requestApi="getDictTable"
        @current-change="onRowClick"
      />
    </div>

    <ProTable
      ref="proTableItem"
      title="数据字典"
      :columns="dictItemCols"
      highlight-current-row
      :initParam="initParam"
      :pagination="false"
      :requestApi="getDictItemByCodeTable"
      @current-change="onRowItemClick"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button v-if="BUTTONS.add" type="primary" :icon="CirclePlus" @click="openDictItemDrawer('新增')" :disabled="!dictRow"
          >新增
        </el-button>
        <el-button v-if="BUTTONS.edit" :icon="EditPen" @click="openDictItemDrawer('编辑')" :disabled="!dictItemRow">
          编辑
        </el-button>
        <el-button v-if="BUTTONS.del" type="danger" :icon="Delete" @click="onDel" :disabled="!dictItemRow"> 删除 </el-button>
      </template>
    </ProTable>
    <DictItemDrawer ref="dictItemDrawerRef" />
  </div>
</template>

<script setup lang="tsx">
import { CirclePlus, EditPen, Delete } from "@element-plus/icons-vue";
import { ColumnProps } from "@/components/ProTable/interface";
import DictItemDrawer from "./components/DictItemDrawer.vue";
import ProTable from "@/components/ProTable/index.vue";
import { Dict } from "@/api/interface";
import { ref, reactive } from "vue";
import { getDictItemByCode, getDictList, addDictItem, editDictItem, delDictItem } from "@/api/modules/set";
import { keys } from "@/utils";
import { ElMessage } from "element-plus";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { useHandleData } from "@/hooks/useHandleData";

const { BUTTONS } = useAuthButtons();

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

const proTableItem = ref();

// 字典配置
const dictCols: ColumnProps[] = [
  { prop: "name", label: "名称" },
  { prop: "key", label: "关键字" },
  { prop: "desc", label: "描述" }
];

// 字典项查询条件
const initParam = reactive({
  key: "",
  skipCount: 0,
  maxResultCount: 10
});

// 字典行
const dictRow = ref<Dict.Dict>();

const dictMap = {
  set: { key: "set", name: "部门", desc: "公司部门, 用于用户管理中的所在部门" },
  publishPlatform: { key: "publishPlatform", name: "发布平台", desc: "账号的发布平台, 用于新增账号时选择" },
  problemTypes: { key: "problemTypes", name: "工单问题类型", desc: "用于工单新建时的选择" },
  handleTypes: { key: "handleTypes", name: "工单处理结果", desc: "用于各部门处理工单时的选择" },
  recycleShop: { key: "recycleShop", name: "回收门店", desc: "用于新增账号时的回收门店选择" },
  system: { key: "system", name: "系统", desc: "用于新增账号时的账号系统选择" },
  grouping: { key: "grouping", name: "回收组", desc: "用于新增账号时的回收组选择" }
};

// 获取字典列表
const getDictTable = async (params: Dict.DictParams) => {
  const pageNum = proTable.value.pageable.pageNum;

  const { data } = await getDictList();

  // @ts-ignore
  const list = keys(data).map(key => dictMap[key]);

  return {
    data: list
  };
};

// 字典项行
const dictItemRow = ref<Dict.DictItem>();

// 表格行被点击
const onRowClick = (row: Dict.Dict) => {
  if (!row) return;
  dictRow.value = row;
  const { key } = row;
  initParam.key = key;
};

const onDel = async () => {
  await useHandleData(
    delDictItem,
    {
      key: dictRow.value!.key,
      id: dictItemRow.value!.value || dictItemRow.value!.id
    },
    `确认删除【${dictItemRow.value!.label}】`
  );
  proTableItem?.value?.getTableList();
};

// 字典项表格行被点击
const onRowItemClick = (row: Dict.DictItem) => {
  if (!row) return;
  dictItemRow.value = row;
};

// 字典项配置
const dictItemCols: ColumnProps[] = [
  { prop: "label", label: "名称" },
  { prop: "id", label: "值", render: ({ row }) => row.value ?? row.id }
];

// 获取字典项
const getDictItemByCodeTable = async () => {
  const { data } = initParam.key ? await getDictItemByCode(initParam.key) : { data: [] };

  // @ts-ignore
  return { data: data[initParam.key] };
};

// 字典项ref
const dictItemDrawerRef = ref();

// 打开字典项
const openDictItemDrawer = (title: string) => {
  if (!dictRow.value) {
    ElMessage.warning("请点击左侧表格中的某一行进行选中");
    return;
  }
  const params = {
    title,
    rowData: title === "新增" ? { key: dictRow.value!.key } : { ...dictItemRow.value, key: dictRow.value!.key },
    isView: title === "查看",
    api: title === "新增" ? addDictItem : editDictItem,
    getTableList: proTableItem.value.getTableList
  };

  dictItemDrawerRef.value.acceptParams(params);
};
</script>
