const { app, BrowserWindow } = require("electron");

require("update-electron-app")();

// modify your existing createWindow() function
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 1400,
    icon: "/path/to/icon.png"
  });

  win.loadFile("./dist/index.html");
};

if (require("electron-squirrel-startup")) app.quit();

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
