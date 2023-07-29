// ? Element 常用表单校验规则

import { typeCode } from "@/api/modules/commodity";

/**
 *  @rule 手机号
 */
export function checkPhoneNumber(rule: any, value: any, callback: any) {
  const regexp = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
  if (value === "") return callback("请输入手机号码");
  if (!regexp.test(value)) return callback(new Error("请输入正确的手机号码"));
  const params = {
    type: rule.field,
    value
  };
  if (value) {
    typeCode(params).then(res => {
      const { data } = res;
      if (data === "0") {
        return callback(new Error("该手机号以存在"));
      } else {
        return callback();
      }
    });
  }
}
export function checkEmail(rule: any, value: any, callback: any) {
  const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (regEmail.test(value)) {
    // 合法的邮箱
    return callback();
  }
  callback(new Error("请输入合法的邮箱"));
}
