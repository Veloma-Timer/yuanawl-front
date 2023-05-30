module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  packagerConfig: {
    appVersion: "0.0.1",
    name: "元阿网络后台管理系统",
    win32metadata: {
      ProductName: "元阿网络后台管理系统",
      CompanyName: "浙江元阿网络科技有限公司",
      FileDescription: "元阿网络后台管理系统"
    }
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {}
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"]
    },
    {
      name: "@electron-forge/maker-deb",
      config: {}
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {}
    }
  ]
};
