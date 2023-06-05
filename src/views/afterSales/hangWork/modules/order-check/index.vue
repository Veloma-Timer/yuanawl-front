<template>
  <div class="icon-box">
    <el-dialog v-model="dialogVisible" title="审核" top="50px" width="600px">
      <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef">
        <el-form-item label="审核人姓名：" prop="name">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="审核结果：" prop="result">
          <el-select v-model="form.result" placeholder="请选择" class="check-select" filterable>
            <el-option label="审核通过" value="Y" />
            <el-option label="审核拒绝" value="N" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="onSubmit()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
const dialogVisible = ref(false);
const openDialog = () => (dialogVisible.value = true);

interface Form {
  name: string;
  result: string;
}
const form = reactive<Form>({
  name: "",
  result: ""
});

const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
  name: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  result: [{ required: true, message: "必填项不能为空", trigger: "change" }]
});

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const cancel = () => {
  Object.keys(form).forEach(key => {
    form[key as keyof typeof form] = "";
  });
  resetForm(ruleFormRef.value);
  dialogVisible.value = false;
};

const onSubmit = async () => {
  await ruleFormRef?.value?.validate((valid: any, fields: any) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

defineExpose({
  openDialog
});
</script>

<style lang="scss" scoped>
.check-select {
  width: 100%;
}
</style>
