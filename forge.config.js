module.exports = {
  packagerConfig: {
    asar: true,
    icon: "/path/to/icon"
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        setupIcon: "/path/to.icon.ico"
      }
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        icon: "/path/to.icon.icns"
      }
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
      config: {
        icon: "/path/to.icon.icns"
      }
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        icon: "/path/to.icon.icns"
      }
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {
        icon: "/path/to.icon.icns"
      }
    }
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {}
    }
  ]
};
