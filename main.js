const path = require('path');
const os = require('os');
const fs = require('fs');
const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron');
const { error } = require('console');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;
// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "WorkFolio",
    width: 820,
    height: 550,
    resizable: false,
    icon: `${__dirname}/login-page-renderer/assets/icons/Icon_256x256.png`,
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
  //uncomment the below line to hide default menu options
  //Menu.setApplicationMenu(null);
});

ipcMain.on('sign-in-attempted', (e, loginCredentials) => {
  e.preventDefault();
  try {
    mainWindow.loadFile(path.join(__dirname, './activity-renderer/index.html')).then(() => {
      mainWindow.webContents.send('sign-in-successful');
    });
  }
  catch (err) {
    console.log(err);
  }
});