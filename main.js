const path = require('path');
const os = require('os');
const fs = require('fs');
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const { error } = require('console');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Login",
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show devtools automatically if in development
  //   if (isDev) {
  //     mainWindow.webContents.openDevTools();
  //   }

  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadFile(path.join(__dirname, './login-page-renderer/index.html'));
}

// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow();
  // There should be something for footer just like menu
  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null));
});

ipcMain.on('sign-in-attempted', () => {
  try {
    mainWindow.loadFile(path.join(__dirname, './activity-renderer/index.html'));
    ipcRenderer.send('sign-in-successful');
  }
  catch (err) {
    console.log(err);
  }
});