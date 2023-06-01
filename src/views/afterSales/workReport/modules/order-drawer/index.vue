<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="900px" :title="`${drawerProps.title}`" :show-close="false">
    <template #header>
      <div class="edit-btn">
        <span>{{ drawerProps.title }}</span>
        <el-button type="primary" @click="edit" v-if="drawerProps.title === '查看'">
          <div>编辑</div>
        </el-button>
      </div>
    </template>
    <div class="first-header">
      <Header title="基本信息" class="header"> </Header>
    </div>
    <el-form
      ref="ruleFormRef"
      label-width="150px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="提交工单时间" prop="time" class="order-time">
        <el-date-picker v-model="drawerProps.row!.time" type="date" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="上报人姓名" prop="username">
        <el-input v-model="drawerProps.row!.username" placeholder="请输入" clearable class="order-input"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="drawerProps.row!.username" placeholder="请输入" clearable class="order-input"></el-input>
      </el-form-item>
      <el-form-item label="最新处理结果" prop="username">
        <el-input v-model="drawerProps.row!.username" placeholder="请输入" clearable class="order-input"></el-input>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="处理次数" prop="username">
            <el-input v-model="drawerProps.row!.username" placeholder="请输入" clearable class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否投保" prop="username">
            <el-input v-model="drawerProps.row!.username" placeholder="请输入" clearable class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最新处理客服姓名" prop="username">
            <el-input v-model="drawerProps.row!.username" placeholder="请输入" clearable class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="回收店铺" prop="username">
            <el-input v-model="drawerProps.row!.username" placeholder="请输入" clearable class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工单星级" prop="username">
            <el-input v-model="drawerProps.row!.username" placeholder="请输入" clearable class="small-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最新处理时间" prop="username">
            <el-date-picker v-model="drawerProps.row!.time" type="date" placeholder="请选择" />
          </el-form-item>
        </el-col>
      </el-row>
      <template v-for="(item, i) in drawerProps.row.list" :key="i">
        <Header :title="`第${i + 1}次处理`" class="header"></Header>
        <el-row :gutter="10" style="margin-top: 24px">
          <el-col :span="8">
            <el-form-item label="处理客服姓名" :prop="'list.' + i + '.a'" :rules="rules.a">
              <el-input v-model="item.a" placeholder="请输入" clearable class="small-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提交时间" :prop="'list.' + i + '.t1'" :rules="rules.t1">
              <el-date-picker v-model="item.t1" type="date" placeholder="请选择" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="处理时间" :prop="'list.' + i + '.t2'" :rules="rules.t2">
              <el-date-picker v-model="item.t2" type="date" placeholder="请选择" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="处理结果" :prop="'list.' + i + '.b'" :rules="rules.b">
              <el-input v-model="item.b" placeholder="请输入" clearable class="small-input"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="" :prop="'list.' + i + '.photo'" :rules="rules.photo">
          <UploadImgs v-model:file-list="item.photo" height="140px" width="140px" border-radius="50%">
            <template #empty>
              <el-icon><Picture /></el-icon>
              <span>请上传照片</span>
            </template>
          </UploadImgs>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
import { SalesOrder } from "@/api/interface";
// import UploadImg from "@/components/Upload/Img.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import Header from "@/components/Header/index.vue";

const rules = reactive({
  a: [{ required: true, message: "必填项不能为空" }],
  t1: [{ required: true, message: "必填项不能为空" }],
  t2: [{ required: true, message: "必填项不能为空" }],
  b: [{ required: true, message: "必填项不能为空" }],
  time: [{ required: true, message: "必填项不能为空" }],
  photo: [{ required: true, message: "必填项不能为空" }],
  username: [{ required: true, message: "必填项不能为空" }]
});

interface DrawerProps {
  time?: Date | null;
  title: string;
  isView: boolean;
  row: Partial<SalesOrder.ResSalesList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  time: null,
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerProps.value.row.list = [
    {
      a: 1,
      t1: "2015-05-16 16:19:15",
      t2: "2013-05-16 16:19:15",
      b: "赔付2w"
    },
    {
      a: 2,
      t1: "2015-05-16 16:19:15",
      t2: "2023-05-16 16:19:15",
      b: "赔付2w"
    }
  ];
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const edit = () => {
  drawerProps.value.isView = false;
  console.log("编辑");
};

defineExpose({
  acceptParams
});
</script>

<style lang="scss" scoped>
.el-drawer__header {
  position: relative;
  button {
    position: absolute;
    right: 20px;
  }
}
.first-header {
  transform: translateY(-20px);
}
.edit-btn {
  div {
    color: var(--el-color-white) !important;
  }
}
.order-input,
.el-input {
  width: 400px !important;
}
.order-time {
  :deep(.el-input__wrapper) {
    width: 400px;
  }
}
</style>
