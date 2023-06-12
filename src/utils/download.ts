function downloadFile(data: any, filename: string, type: string) {
  // 创建 Blob 对象
  const blob = new Blob([data], { type: type });
  // 判断当前浏览器是否是IE，由于IE是没有download 方法的，需要用msSaveBlob() 或 msSaveOrOpenBlob()
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // 兼容IE
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // 创建 URL 对象
    const url = URL.createObjectURL(blob);
    // 创建链接
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    // 模拟点击链接进行下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 释放 URL 对象
    URL.revokeObjectURL(url);
  }
}

export const exportData = (url: any, ids: any) => {
  url(ids).then(buffer => {
    downloadFile(buffer, "报表.xlsx", "application/vnd.ms-excel");
  });
};
