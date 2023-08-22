// forge.config.ts
const RELEASE_APP_DIR = path.join(__dirname, `./out/${APP_NAME}-${process.platform}-${ARCH}/${APP_NAME}.app`);

const wixUiTemplate = `    <UI Id="UserInterface">
      <Property Id="WixUI_Mode" Value="InstallDir" />

      <TextStyle Id="WixUI_Font_Normal" FaceName="Tahoma" Size="8" />
      <TextStyle Id="WixUI_Font_Bigger" FaceName="Tahoma" Size="12" />
      <TextStyle Id="WixUI_Font_Title" FaceName="Tahoma" Size="9" Bold="yes" />

      <Property Id="DefaultUIFont" Value="WixUI_Font_Normal" />

      <DialogRef Id="ErrorDlg" />
      <DialogRef Id="FatalError" />
      <DialogRef Id="FilesInUse" />
      <DialogRef Id="MsiRMFilesInUse" />
      <DialogRef Id="PrepareDlg" />
      <DialogRef Id="ProgressDlg" />
      <DialogRef Id="ResumeDlg" />
      <DialogRef Id="UserExit" />

      <Publish Dialog="ExitDialog" Control="Finish" Event="EndDialog" Value="Return" Order="999">1</Publish>

      <Publish Dialog="WelcomeDlg" Control="Next" Event="NewDialog" Value="InstallDirDlg">NOT Installed</Publish>
      <Publish Dialog="WelcomeDlg" Control="Next" Event="NewDialog" Value="VerifyReadyDlg">Installed AND PATCH</Publish>

      <Publish Dialog="InstallDirDlg" Control="Back" Event="NewDialog" Value="WelcomeDlg">1</Publish>
      <Publish Dialog="InstallDirDlg" Control="Next" Event="SetTargetPath" Value="[WIXUI_INSTALLDIR]" Order="1">1</Publish>
      <Publish Dialog="InstallDirDlg" Control="Next" Event="DoAction" Value="WixUIValidatePath" Order="2">NOT WIXUI_DONTVALIDATEPATH</Publish>
      <Publish Dialog="InstallDirDlg" Control="Next" Event="SpawnDialog" Value="InvalidDirDlg" Order="3"><![CDATA[NOT WIXUI_DONTVALIDATEPATH AND WIXUI_INSTALLDIR_VALID<>"1"]]></Publish>
      <Publish Dialog="InstallDirDlg" Control="Next" Event="NewDialog" Value="VerifyReadyDlg" Order="4">WIXUI_DONTVALIDATEPATH OR WIXUI_INSTALLDIR_VALID="1"</Publish>
      <Publish Dialog="InstallDirDlg" Control="ChangeFolder" Property="_BrowseProperty" Value="[WIXUI_INSTALLDIR]" Order="1">1</Publish>
      <Publish Dialog="InstallDirDlg" Control="ChangeFolder" Event="SpawnDialog" Value="BrowseDlg" Order="2">1</Publish>

      <Publish Dialog="VerifyReadyDlg" Control="Back" Event="NewDialog" Value="InstallDirDlg" Order="1">NOT Installed</Publish>
      <Publish Dialog="VerifyReadyDlg" Control="Back" Event="NewDialog" Value="MaintenanceTypeDlg" Order="2">Installed AND NOT PATCH</Publish>
      <Publish Dialog="VerifyReadyDlg" Control="Back" Event="NewDialog" Value="WelcomeDlg" Order="2">Installed AND PATCH</Publish>

      <Publish Dialog="MaintenanceWelcomeDlg" Control="Next" Event="NewDialog" Value="MaintenanceTypeDlg">1</Publish>

      <Publish Dialog="MaintenanceTypeDlg" Control="RepairButton" Event="NewDialog" Value="VerifyReadyDlg">1</Publish>
      <Publish Dialog="MaintenanceTypeDlg" Control="RemoveButton" Event="NewDialog" Value="VerifyReadyDlg">1</Publish>
      <Publish Dialog="MaintenanceTypeDlg" Control="Back" Event="NewDialog" Value="MaintenanceWelcomeDlg">1</Publish>

    </UI>
    <Property Id="WIXUI_INSTALLDIR" Value="APPLICATIONROOTDIRECTORY" />
    <UIRef Id="WixUI_Common" />`;

module.exports = {
  packagerConfig: {
    name: "APP_NAME",
    // 不加扩展名，MAC 会自动查找 .icns、WIN 使用 .ico
    icon: "./icon/icon",
    // 最终包不使用的代码，不要打入 asar
    ignore: [/\.yarn/, /src\/render/],
    appBundleId: `com.xxx.xxx`,
    appCopyright: `Copyright © 2023 ${packageJson.author}`
  },
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      config: {
        icon: "./icon/icon.icns",
        background: "./icon/background.png",
        format: "ULFO",
        contents: [
          { x: 192, y: 244, type: "file", path: RELEASE_APP_DIR },
          { x: 448, y: 244, type: "link", path: "/Applications" },
          { x: 192, y: 700, type: "position", path: ".background" },
          { x: 292, y: 700, type: "position", path: ".VolumeIcon.icns" },
          { x: 392, y: 700, type: "position", path: ".DS_Store" },
          { x: 492, y: 700, type: "position", path: ".Trashes" }
        ]
      }
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        authors: packageJson.author,
        description: packageJson.description,
        copyright: packageJson.author,
        iconUrl: "https://www.xxxx.com/favicon.ico", // http url only
        setupIcon: path.join(__dirname, `icon/icon.ico`),
        skipUpdateIcon: true
        // certificateFile: './cert.pfx',
        // certificatePassword: process.env.CERTIFICATE_PASSWORD
      }
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        authors: packageJson.author,
        description: packageJson.description,
        copyright: packageJson.author,
        iconUrl: "https://www.xxxx.com/favicon.ico", // http url only
        setupIcon: path.join(__dirname, `icon/icon.ico`),
        skipUpdateIcon: true
        // certificateFile: './cert.pfx',
        // certificatePassword: process.env.CERTIFICATE_PASSWORD
      }
    },
    {
      name: "@electron-forge/maker-wix",
      config: {
        language: '2052" Codepage="utf-8',
        cultures: "zh-CN,en-US",
        icon: path.join(__dirname, `./icon/icon.ico`),
        shortName: "APP_EN_NAME",
        manufacturer: packageJson.author,
        appUserModelId: `com.xxx.xxx`,
        upgradeCode: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        features: {
          autoUpdate: true, // 无法使用
          autoLaunch: false
        },
        ui: {
          template: wixUiTemplate
        }
      }
    },
    {
      name: "@felixrieseberg/electron-forge-maker-nsis",
      config: {
        // codesigning: {
        //   certificateFile?: string;
        //   certificatePassword?: string;
        // },
        updater: {}
      }
    }
  ],
  // forge.config.ts
  hooks: {
    preMake: async () => {
      if (process.platform == "darwin") {
        await makeMacProfile();
        await signMac("/path/to/xxx.app", "APP_NAME");
      }
    },
    postMake: async () => {
      if (process.platform == "darwin") {
        await notarizeMac("/path/to/xxx.dmg");
      }
    }
  }
};
