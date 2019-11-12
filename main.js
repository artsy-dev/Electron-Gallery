// Modules to control application life and create native browser window
const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false
    },
    frame: false,
    minHeight: 500,
    minWidth: 760,
    experimentalFeatures: true,
    backgroundColor: '#212121',
    icon: path.join(__dirname, './images/manifest/icon-144x144.png')
  })

  // mainWindow.setMenuBarVisibility(false);
  
  // and load the index.html of the app.
  mainWindow.loadURL('app://localhost/index.html')

  if (process.env.NODE_ENV === "development") {
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Maximize window to screen
  mainWindow.maximize();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if(fs.existsSync('extensions.json')) {
    const extensions = require('./extensions.json');
    for(const [name, path] of Object.entries(extensions)) {
      try {
        BrowserWindow.addDevToolsExtension(path);
      } catch {
        console.warn(`Failed to install devtools plugin: ${name}`);
      }
    }
  }

  protocol.registerFileProtocol('app', function(request, callback) {
    const { pathname } = url.parse(request.url);

    const match = /^\/__local_file__\/([a-zA-Z]:.*)/.exec(pathname);
    let filePath;
    if(match) {
      filePath = path.normalize(decodeURI(match[1]));
    } else {
      filePath = path.join(__dirname, pathname);
    }
    callback(filePath);
  }, function (error) {
    if (error)
      console.error('Failed to register protocol')
  });
  
  createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
