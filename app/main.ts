import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import * as download from 'electron-dl';

import { fork, execFile } from 'child_process';


// Initialize remote module
require('@electron/remote/main').initialize();


let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  if(require('electron-squirrel-startup')) return;

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      enableRemoteModule : true // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
    },
  });


  if (serve) {
    win.webContents.openDevTools();
    win.webContents.on('did-fail-load', () => win.loadURL('http://localhost:4200'));
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    // let pathIndex = './index.html';

    // if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
    //    // Path when running electron in local folder
    //   pathIndex = '../dist/index.html';
    // }

    win.loadURL(
      url.format({
        pathname: path.join(__dirname, `/index.html`),
        protocol: "file:",
        slashes: true
      })
    );
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    setTimeout(createWindow, 400);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

function writeToDeckboardFile(data) {
  let p = path.join(__dirname, 'macrodeck_url.json');
  fs.writeFile(p,data , function(err) {
    if(err) {
        console.log(err);
    }
    console.log("The file was saved!");
  });
}


function writeToDeckboardButtonFile(data) {
  let p = path.join(__dirname, 'deckboard_getData', 'finalData', 'finalButton.json');
  fs.writeFile(p,data , function(err) {
    if(err) {
        console.log(err);
    }
    console.log("The file was saved!");
  });
}

function writeToDeckboardCustomButtonFile(data) {
  let p = path.join(__dirname, 'deckboard_getData', 'finalData', 'customButtons.json');
  fs.writeFile(p,data , function(err) {
    if(err) {
        console.log(err);
    }
    console.log("The file was saved!");
  });
}

function readToDeckboardCustomButtonFile(){
  let p = path.join(__dirname, 'deckboard_getData', 'finalData', 'customButtons.json');
  if(fs.existsSync(p)){
    return fs.readFileSync(p,'utf8')
  }else {
    fs.writeFileSync(p, `{"buttons":[]}`);
  }
  
}

function readUrl(): string{
  let p = path.join(__dirname, 'macrodeck_url.json');
  if(fs.existsSync(p)){
    return fs.readFileSync(p,'utf8')
  }
  else {
    writeToDeckboardFile("NoURLSet");
  }
  return "NotSet";

}

function readDeckboardFile(){
  let p = path.join(__dirname, 'deckboard_getData', 'finalData', 'finalButton.json');
  if(fs.existsSync(p)){
    return fs.readFileSync(p,'utf8')
  }
  else{
    fs.writeFileSync(p, `{"buttons":[]}`);
  }
}

ipcMain.on('writeUrl', (event, data) => {
  writeToDeckboardFile(data);
});

ipcMain.on('readUrl', (event, data) => {
  event.returnValue = readUrl();
});

ipcMain.on('readMacrodeckData', (event, data) => {
  event.returnValue = readDeckboardFile();
});

ipcMain.on('writeMacrodeckData', (event, data) => {
  writeToDeckboardButtonFile(data);
  event.returnValue = 'Ok'
});


ipcMain.on('readCustomMacrodeckData', (event, data) => {
  event.returnValue = readToDeckboardCustomButtonFile();
});

ipcMain.on('writeCustomMacrodeckData', (event, data) => {
  writeToDeckboardCustomButtonFile(data);
  event.returnValue = 'Ok'
});


ipcMain.on('saveDeckboardData', (event, data) => {
  let p = path.join(__dirname, 'deckboard_getData','merge-files.js');
  const child = fork(p, args, {cwd:  path.join(__dirname, 'deckboard_getData')});
  event.returnValue = true;
  child.on('close', function (){
    event.sender.send('deckBoardDataDone', false)
  }) 
  child.on('error', (err) => {
    event.sender.send(err.message);
  });

  child.on('message', (msg) => {
    event.sender.send(msg.toString());
})

});

ipcMain.on('downloadMMS', (event, data) => {
  console.log(__dirname);
  console.log('I AM DOING MY PART');
  download.download(win, data, {directory:__dirname + 'temp/'})
    .then(dl => {

      execFile(dl.getSavePath(), function(err, data) {
        console.log(err)
        console.log(data.toString());
      });

      
    })
    .catch(console.error);
    event.returnValue = 'Ok'
})
