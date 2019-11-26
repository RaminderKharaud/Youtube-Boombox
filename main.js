/*
Author: Raminderpreet Singh Kharaud
version: 1.0;
Data: 12/10/2018

*/
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const { app, BrowserWindow,ipcMain, dialog } = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let downloadWin = new Array(10);

function createWindow () {
  for(i = 0; i < downloadWin.length; i++){
    downloadWin[i] = null;
  }
  // Create the browser window.
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 800,
    height: 650,
    minWidth: 800,
    minHeight: 500,
    icon: path.join('images/icon1.png'),
    frame: false });

  // and load the index.html of the app.
  win.loadFile(path.join(__dirname,'index.html'));

  // Open the DevTools.
//  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('saveMp3File', (event, videoInfo) => {
  dialog.showSaveDialog(win,
    { title: 'Save Mp3 File',
      defaultPath: videoInfo.Title, //could also use '~/song.mp3'
      filters: [
     { name: 'MP3 Files', extensions: ['mp3'] }
   ]},
   function (fileName) {
    if (fileName === undefined) return;

    if(fileName.substring(fileName.length - 3, fileName.length) === 'mp3'){
      //event.sender.send('Mp3FilePath', fileName);
      var limit = true;
      for(i = 0; i < downloadWin.length; i++){
        if(downloadWin[i] == null){
          creatDownLoadWin(videoInfo,fileName,i);
          limit = false;
          break;
        }
      }
      if(limit){
        var message = 'you already have 10 downloads in progress';
        message += 'please wait until one of the download is completed';
        event.sender.send('overLimit', message);
      }

    }else{
      //alert("filename/path or extension is wrong");
      return;
    }
  });

});

function creatDownLoadWin(videoInfo,fileName,index){
  // Create the browser window.
  downloadWin[index] = new BrowserWindow({
    webPreferences: {
           nodeIntegration: true
       },
    width: 500,
    height: 230,
    minWidth: 500,
    minHeight: 230,
    frame: false});
    //downloadWin[index].webContents.openDevTools()
  // and load the index.html of the app.
  downloadWin[index].loadFile(path.join(__dirname,'progressWin/progress.html'));
  //downloadWin[index].webContents.openDevTools()
  //send data to newly created window
  downloadWin[index].webContents.on('did-finish-load', function() {
    downloadWin[index].webContents.send('downloadFile',videoInfo,fileName,process.platform);
  });
    // Emitted when the window is closed.
    downloadWin[index].on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      downloadWin[index] = null;
  });

}
