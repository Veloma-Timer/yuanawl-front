import { ElNotification, ElMessage } from "element-plus";
import { writeBinaryFile } from "@tauri-apps/api/fs";
import { downloadDir } from "@tauri-apps/api/path";
import { save } from "@tauri-apps/api/dialog";

/**
 * @description 接收数据流生成 blob，创建链接，下载文件
 * @param {Function} api 导出表格的api方法 (必传)
 * @param {String} tempName 导出的文件名 (必传)
 * @param {Object} params 导出的参数 (默认{})
 * @param {Boolean} isNotify 是否有导出消息提示 (默认为 true)
 * @param {String} fileType 导出的文件格式 (默认为.xlsx)
 * */
export const useDownload = async (
  api: (param: any) => Promise<any>,
  tempName: string,
  params: any = {},
  isNotify: boolean = true,
  fileType: string = ".xlsx"
) => {
  if (isNotify) {
    ElNotification({
      title: "温馨提示",
      message: "如果数据庞大会导致下载缓慢哦，请您耐心等待！",
      type: "info",
      duration: 3000
    });
  }
  try {
    const res = await api(params);
    // const blob = new Blob([res]);
    // 兼容 edge 不支持 createObjectURL 方法
    // if ("msSaveOrOpenBlob" in navigator) return window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
    // const blobUrl = window.URL.createObjectURL(blob);
    // const exportFile = document.createElement("a");
    // exportFile.style.display = "none";
    // exportFile.download = `${tempName}${fileType}`;
    // exportFile.href = blobUrl;
    // document.body.appendChild(exportFile);
    // exportFile.click();
    // 去除下载对 url 的影响
    // document.body.removeChild(exportFile);
    // window.URL.revokeObjectURL(blobUrl);
    // const blob = new Blob([res], { type: "application/octet-stream" });
    // const link = document.createElement("a");
    // link.href = window.URL.createObjectURL(blob);
    // link.download = `${tempName}${fileType}`;
    // link.click();

    const basePath = (await downloadDir()) + `/${tempName}`;
    const selPath = await save({
      title: `保存文件: ${tempName}`,
      defaultPath: basePath,
      filters: [
        {
          name: fileType.slice(1),
          extensions: [fileType.slice(1)]
        }
      ]
    });
    // 开始发送下载请求
    if (selPath) {
      try {
        await writeBinaryFile({ contents: res, path: `${selPath}` });
        console.log(`【文件保存成功】: ${selPath}`);
        ElMessage({
          type: "success",
          message: `【文件保存成功】: ${selPath}`
        });
      } catch (error) {
        ElMessage({
          type: "error",
          message: `【文件保存失败】: ${(error as Error).message}`
        });
        console.log(`【文件保存失败】: ${(error as Error).message}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
