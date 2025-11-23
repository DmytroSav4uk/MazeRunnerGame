const { app, BrowserWindow } = require('electron');
const path = require('path');

process.on('uncaughtException', (error) => {
  console.error("Unexpected error: ", error);
});

let mainWindow;

function startBackend() {
  try {
    const serverPath = path.join(__dirname, "server.js");
    require(serverPath);
    console.log("Backend started");
  } catch (err) {
    console.error("Backend error:", err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minHeight: 800,
    minWidth: 1000,
    maxHeight:800,
    maxWidth:1000,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      devTools: true
    }
  });

  mainWindow.setMenu(null);

  mainWindow.loadFile(
    path.join(__dirname, 'dist/MazeRunnerGame/browser/index.html')
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
