#!/usr/bin/env node

const { exec } = require('child_process');

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
      decoded
    });
    if (decoded.running === true) connected = true;
  });
  if (connected) {
    console.log('[ONLINE] Connected');
    clearInterval(interval);
    process.exit(0);
  }
  // console.log('stdout:', stdout);
  // console.log('stderr:', stderr);
  // try {
  //   const request = http
  //     .request({
  //       method: 'GET',
  //       host,
  //       port: 4000
  //     });
  //     request.on('connect', () => {
  //       console.log('[ONLINE] Connected');
  //     });
  //     request.on('disconnect', () => {
  //       console.log('[ONLINE] Disconnect');
  //     });
  //     request.on('data', (d) => {
  //       console.log('[ONLINE] Data');
  //       d => data += d
  //     });
  //     request.on('end', () => {
  //       clearTimeout(timeout);
  //       console.log('[ONLINE] Success connect server');
  //       console.log('[ONLINE] Data:', data);
  //     });
  //     request.on('success', () => {
  //       clearTimeout(timeout);
  //       console.log('[ONLINE] Success connect server');
  //       console.log('[ONLINE] Data:', data);
  //     });
  //     request.on('error', (e) => {
  //       console.log('[ONLINE] Error connect server');
  //       console.log(e);
  //     });
  //     request.end();
  // } catch (e) {

  // }
}

process.on('uncaughtException', (err) => {});