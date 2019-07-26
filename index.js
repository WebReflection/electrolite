'use strict'; // by Andrea Giammarchi - @WebReflection

var
  fs = require('fs'),
  path = require('path'),
  electron = require('electron'),
  dbPath = path.join(__dirname, 'app.json'),
  db = fs.existsSync(dbPath) ? require(dbPath) : {},
  info = require('./info'),
  url = info.url,
  app = electron.app,
  BrowserWindow = electron.BrowserWindow
;

if (!db.hasOwnProperty(url)) db[url] = {};

app.commandLine.appendSwitch('--ignore-gpu-blacklist');
app.once('ready', function () {
  var
    area = electron.screen.getPrimaryDisplay().workAreaSize,
    width = db[url].width || 320,
    height = db[url].height || 568,
    x = db[url].x || Math.round((area.width - width) / 2),
    y = db[url].y || Math.round((area.height - height) / 2),
    updateDB = function (e) {
      var
        position = e.sender.getPosition(),
        size = e.sender.getSize(),
        x = position[0],
        y = position[1],
        width = size[0],
        height = size[1]
      ;
      db[url] = {
        lastVisit: new Date(),
        x: x,
        y: y,
        width: width,
        height: height
      };
    }
  ;

  new BrowserWindow({
    x: x, y: y - (process.platform === 'linux' ? 38 : 0),
    width: width, height: height,
    title: info.hostname,
    icon: path.join(__dirname, 'icon', (
      process.platform === 'linux' ?
        'linux.png' : (
          process.platform === 'win32' ?
            'win.ico' :
            'mac.icns'
        )
    )),
    autoHideMenuBar: true,
    webPreferences: {
      experimentalFeatures: true,
      nodeIntegration: false
    }
  })
    .on('move', updateDB)
    .on('resize', updateDB)
    .once('closed', function () {
      fs.writeFileSync(dbPath, JSON.stringify(db, null, '  '));
    })
    .loadURL(url);

});
