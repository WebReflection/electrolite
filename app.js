#!/usr/bin/env node

require('child_process').spawn(
  require('electron'),
  [require('path').join(__dirname, 'index.js')]
    .concat(require('./info').url, process.argv.slice(3)),
  {detached: true, stdio: 'inherit'}
).unref();
