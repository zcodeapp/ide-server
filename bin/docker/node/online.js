#!/usr/bin/env node

const { exec } = require('child_process');
const localVersion = require('../../../package.json');

let connected;
let host = process.argv[2];

if (!host) {
  console.error('Host not found! usage: bin/docker/node/online <hostname>');
  return;
}

host = host
  .replace("\r", '')
  .replace("\n", '')

let timeout = setTimeout(_timeout, 5000);
let interval = setInterval(_interval, 1000);

function _timeout() {
  console.log('[ONLINE] Timeout');
  clearInterval(interval);
  process.exit(1);
}

async function _interval() {
  console.log('[ONLINE] Try connect server', {
    host
  });
  let data = '';
  const child = await exec(`curl -X GET http://${host}:4000/`);
  child.stdout.on('data', _ => data += _);
  child.on('close', () => {
    const decoded = JSON.parse(data);
    console.log('[ONLINE] Data received', {
      data,
      decoded,
      localVersion: localVersion.version
    });
    if (decoded.running === true) {
      console.log('[ONLINE] Data running');
      if (decoded.version == localVersion.version) {
        console.log('[ONLINE] Correct version');
        connected = true;
      } else {
        console.log('[ONLINE] Different local version of the image');
      }
    }
  });
  if (connected) {
    console.log('[ONLINE] Connected');
    clearInterval(interval);
    process.exit(0);
  }
}

process.on('uncaughtException', (err) => {
  console.log(err)
});