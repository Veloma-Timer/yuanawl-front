import http from "@/api";
import { PORT3 } from "@/api/config/servicePort";

export const saveFile = ({ data }: any, filename: string) => {
  const uInt8Array = new Uint8Array(data); //先将返回的二进制数组转化为js的二进制数组
  let blob = new Blob([uInt8Array], { type: "application/vnd.ms-excel" }); //然后创建blob对象，文件类型设置为excel的类型
  let blobURL = window.URL.createObjectURL(blob); //然后创建一个可访问的URL
  let tempLink = document.createElement("a"); //创建a标签去下载
  tempLink.style.display = "none";
  tempLink.href = blobURL;
  tempLink.setAttribute("download", filename + ".xlsx");
  if (typeof tempLink.download === "undefined") {
    tempLink.setAttribute("target", "_blank");
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
};

export const download = async (fileName: string) => {
  const data = await http.post(PORT3 + "/base_account/export?pageNum=1&pageSize=10");
  saveFile(data, fileName);
};
