<template>
  <div class="flex flex-row h-full">
    <!--<div class="w-3/12 mr-5">-->
    <!--  <ProTable-->
    <!--    ref="proTable"-->
    <!--    title="数据字典"-->
    <!--    :highlightCurrentRow="true"-->
    <!--    :columns="dictCols"-->
    <!--    :requestApi="getDictTable"-->
    <!--    @current-change="onRowClick"-->
    <!--  />-->
    <!--</div>-->

    <!--<ProTable-->
    <!--  ref="proTableItem"-->
    <!--  title="数据字典"-->
    <!--  :columns="dictItemCols"-->
    <!--  highlight-current-row-->
    <!--  :initParam="initParam"-->
    <!--  :pagination="false"-->
    <!--  :requestApi="getDictItemByCodeTable"-->
    <!--  @current-change="onRowItemClick"-->
    <!--&gt;-->
    <!--  &lt;!&ndash; 表格 header 按钮 &ndash;&gt;-->
    <!--  <template #tableHeader>-->
    <!--    <el-button type="primary" :icon="CirclePlus" @click="openDictItemDrawer('新增')">新增</el-button>-->
    <!--    <el-button :icon="EditPen" @click="openDictItemDrawer('编辑')">编辑</el-button>-->
    <!--    <el-button type="danger" :icon="Delete" plain @click="onDelDictItem" :disabled="!dictItemRow"> 删除</el-button>-->
    <!--  </template>-->
    <!--</ProTable>-->
    <!--<DictItemDrawer ref="dictItemDrawerRef" />-->
  </div>
</template>

<script setup lang="tsx">
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import { ColumnProps } from "@/components/ProTable/interface";
import DictItemDrawer from "./components/DictItemDrawer.vue";
import ProTable from "@/components/ProTable/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { Dict } from "@/api/interface";
import { ref, reactive } from "vue";
import { getDictItemByCode, getDictList, delDictItem, addDictItem, editDictItem } from "@/api/modules/set";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

const proTableItem = ref();

// 字典配置
const dictCols: ColumnProps[] = [
  { prop: "name", label: "名称" },
  { prop: "code", label: "编码" },
  { prop: "displayName", label: "展示名称" },
  { prop: "description", label: "描述" }
];

// 字典项查询条件
const initParam = reactive({
  code: "",
  skipCount: 0,
  maxResultCount: 10
});

// 字典行
const dictRow = ref<Dict.Dict>();

// 获取字典列表
const getDictTable = async (params: Dict.DictParams) => {
  const pageNum = proTable.value.pageable.pageNum;

  const skipCount = !pageNum ? 0 : pageNum - 1;

  initParam.maxResultCount = params.pageSize;
  params.maxResultCount = params.pageSize;

  const { items, totalCount } = await getDictList({ ...params, skipCount: skipCount * params.pageSize });

  if (!initParam.code) {
    initParam.code = items[0].code;
    proTable.value.setCurrentRow(items[0]);
  }

  return {
    data: {
      pageNum,
      pageSize: params.pageSize,
      total: totalCount || items.length,
      list: items
    }
  };
};

// 删除字典项
const onDelDictItem = async () => {
  await useHandleData(delDictItem, { parentId: dictRow.value!.id, name: dictItemRow.value!.name }, "删除所选信息");
  proTableItem.value.setCurrentRow();
  proTableItem.value.clearSelection();
  proTableItem.value.getTableList();
};

// 字典项行
const dictItemRow = ref<Dict.DictItem>();

// 表格行被点击
const onRowClick = (row: Dict.Dict) => {
  if (!row) return;
  dictRow.value = row;
  const { code } = row;
  initParam.code = code;
};

// 字典项表格行被点击
const onRowItemClick = (row: Dict.DictItem) => {
  if (!row) return;
  dictItemRow.value = row;
};

// 字典项配置
const dictItemCols: ColumnProps[] = [
  { prop: "name", label: "名称" },
  { prop: "displayName", label: "显示名称" },
  { prop: "description", label: "说明" },
  { prop: "defaultValue", label: "默认值" }
];

// 获取字典项
const getDictItemByCodeTable = async () => {
  const { items } = initParam.code ? await getDictItemByCode(initParam.code) : { items: [] };

  return { data: items };
};

// 字典项ref
const dictItemDrawerRef = ref();

// 打开字典项
const openDictItemDrawer = (title: string) => {
  const params = {
    title,
    rowData: title === "新增" ? { parentId: dictRow.value!.id } : { ...dictItemRow.value, parentId: dictRow.value!.id },
    isView: title === "查看",
    api: title === "新增" ? addDictItem : editDictItem,
    getTableList: proTableItem.value.getTableList
  };

  dictItemDrawerRef.value.acceptParams(params);
};
</script>
