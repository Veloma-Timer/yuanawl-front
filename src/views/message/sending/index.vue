<template>
  <div class="table-box">
    <el-form ref="ruleFormRef" class="demo-ruleForm" :model="ruleForm" :rules="rules" label-width="120px" label-suffix=" :">
      <el-form-item label="游戏账号" prop="accountId">
        <el-input v-model="ruleForm.accountId" placeholder="请输入" clearable class="order-input"></el-input>
      </el-form-item>
      <el-form-item label="短信模板" prop="message">
        <el-input v-model="ruleForm.message" placeholder="请输入" clearable class="order-input"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="signature">
        <div class="cell">
          <div class="cell-phone"></div>
          <span>一行一个号码，注意不要超过20万行，当前已输入<span>0</span>个</span>
        </div>
      </el-form-item>
      <el-form-item label="发送时间" prop="sendingTime">
        <el-radio-group v-model="ruleForm.sendingTime">
          <el-radio :label="1">立即发送</el-radio>
          <el-radio :label="2">定时发送</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="号码去重" prop="reduction">
        <el-radio-group v-model="ruleForm.reduction">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { Message } from "@/api/interface";
const ruleForm: Partial<Message.Sending> = reactive({
  accountId: "",
  message: "",
  reduction: true,
  sendingTime: 2
});
const rules = reactive({
  accountId: [{ required: true, message: "必填项不能为空" }],
  message: [{ required: true, message: "必填项不能为空" }],
  reduction: [{ required: true, message: "必填项不能为空" }],
  sendingTime: [{ required: true, message: "必填项不能为空" }]
});
</script>
<style scoped lang="scss">
.table-box {
  padding: 20px;
  .demo-ruleForm {
    width: 40%;
  }
  .cell {
    width: 100%;
    .cell-phone {
      width: 100%;
      height: 216px;
      border: 1px solid #dadada;
    }
  }
}
</style>
