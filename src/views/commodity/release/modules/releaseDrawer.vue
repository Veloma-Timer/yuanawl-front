<template>
  <el-dialog v-model="drawerVisible" :title="`${drawerProps.title}发布订单`" width="660px">
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="账号编码" prop="accountCode">
        <el-select v-model="drawerProps.row!.accountCode" placeholder="请选择账户" class="w-full" filterable disabled>
          <el-option v-for="item in customerMap" :key="item.id" :label="item.accountCode" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布人" prop="accountPublisherId">
        <el-select v-model="drawerProps.row!.accountPublisherId" placeholder="请选择发布人" class="w-full" filterable disabled>
          <el-option v-for="item in transCatUploadedMap" :key="item.id" :label="item.userName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间" prop="accountPublisherTimer">
        <el-date-picker
          v-model="drawerProps.row!.accountPublisherTimer"
          format="YYYY-MM-DD hh:mm:ss"
          class="w-full"
          disabled
          value-format="YYYY-MM-DD hh:mm:ss"
          type="datetime"
          placeholder="请选择发布时间"
        />
      </el-form-item>
      <!--<el-form-item label="发布时间" prop="rollBackTimer">-->
      <!--  <el-date-picker-->
      <!--    v-model="drawerProps.row!.rollBackTimer"-->
      <!--    format="YYYY-MM-DD hh:mm:ss"-->
      <!--    disabled-->
      <!--    value-format="YYYY-MM-DD hh:mm:ss"-->
      <!--    type="datetime"-->
      <!--    placeholder="请选择发布时间"-->
      <!--  />-->
      <!--</el-form-item>-->
      <el-form-item label="商品首次定价">
        <el-input v-model="drawerProps.row!.publishPrice" placeholder="Please input">
          <template #prepend>¥</template>
        </el-input>
        <!--<el-input-->
        <!--  v-model="drawerProps.row!.publishPrice"-->
        <!--  placeholder="请输入商品首次定价"-->
        <!--  clearable-->
        <!--  :formatter="value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"-->
        <!--  :parser="value => value.replace(/\$\s?|(,*)/g, '')"-->
        <!--/>-->
      </el-form-item>
      <el-form-item label="发布平台" prop="publishPlatform">
        <el-select v-model="drawerProps.row!.publishPlatform" placeholder="请选择发布平台" class="w-full" filterable multiple>
          <el-option v-for="item in handleMap" :key="item.value" :label="item.label" :value="item.value!" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布备注">
        <el-input
          v-model="drawerProps.row!.publishRemark"
          :autosize="{ minRows: 3, maxRows: 5 }"
          type="textarea"
          resize="none"
          placeholder="请输入账号描述"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item v-if="drawerProps.row.isPublish === '1'" label="回滚平台" prop="rollBackPlatform">
        <el-select v-model="drawerProps.row!.rollBackPlatform" placeholder="请选择回滚平台" filterable multiple>
          <el-option v-for="item in handleMap" :key="item.value" :label="item.label" :value="item.value!" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Commodity } from "@/api/interface/commodity/commodity";
import { getUserAll } from "@/api/modules/user";
import { getRecycleList } from "@/api/modules/commodity";
import { sellKeyMap } from "@/api/modules/dictionary";
import { IOptions } from "@/typings";
import { User } from "@/api/interface";

const rules = reactive({
  accountPublisherId: [{ required: true, message: "必填项不能为空" }],
  id: [{ required: true, message: "必填项不能为空" }],
  accountPublisherTimer: [{ required: true, message: "必填项不能为空" }],
  publishPrice: [{ required: true, message: "必填项不能为空" }],
  rollBackPlatform: [{ required: true, message: "必填项不能为空" }],
  publishPlatform: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Commodity.Release>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
// 发布人
const transCatUploadedMap = ref<User.ResUser[]>([]);
// 回收账户列表
const customerMap = ref<Commodity.Account[]>([]);
// 发布平台
const handleMap = ref<IOptions>([]);
const publishMap = () => {
  sellKeyMap().then(res => {
    const {
      data: { publishPlatform = [] }
    } = res;

    handleMap.value = publishPlatform;
  });
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}发布订单成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
const setAllList = async () => {
  const { data = [] } = await getUserAll();
  const {
    data: { list = [] }
  } = await getRecycleList({});
  transCatUploadedMap.value = data as any;
  customerMap.value = list;
  publishMap();
};
setAllList();
defineExpose({
  acceptParams
});
</script>
<style scoped lang="scss">
.edit-btn {
  div {
    color: var(--el-color-white) !important;
  }
}
.el-input-number {
  width: 190px !important;
}
</style>
