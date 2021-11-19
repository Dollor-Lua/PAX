const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

if (require("electron-squirrel-startup")) {
    app.quit();
}

var mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 977,
        height: 512,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "js/pre.js"),
            contextIsolation: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("close", function () {
    app.quit();
});

ipcMain.on("minimize", function () {
    if (mainWindow) mainWindow.minimize();
});

var maximized = false;
ipcMain.on("maximize", function () {
    if (mainWindow) {
        if (!maximized) mainWindow.maximize();
        else mainWindow.unmaximize();
    }
    maximized = !maximized;
});

ipcMain.on("getpath", function(e, p) {
    e.reply("getpath-reply", app.getPath(p))
})