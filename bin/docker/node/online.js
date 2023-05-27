#!/usr/bin/env node

const http = require('http');

let host = process.argv[2];

if (!host) {
  console.error('Host not found! usage: bin/docker/node/online <hostname>');
  return;
}

host = host.replace("\r", '')
host = host.replace("\n", '')

let data;
let timeout = setTimeout(_timeout, 5000);
let interval = setInterval(_interval, 1000);

function _timeout() {
  cleanInterval(interval);
}

function _interval() {
  console.log('[ONLINE] Try connect server', {
    host
  });
  try {
    const request = http
      .request({
        method: 'GET',
        host,
        port: 4000
      });
      request.on('data', (d) => {
        console.log('[ONLINE] Data');
        d => data += d
      });
      request.on('end', () => {
        clearTimeout(timeout);
        console.log('[ONLINE] Success connect server');
        console.log('[ONLINE] Data:', data);
      });
      request.on('success', () => {
        clearTimeout(timeout);
        console.log('[ONLINE] Success connect server');
        console.log('[ONLINE] Data:', data);
      });
      request.on('error', (e) => {
        console.log('[ONLINE] Error connect server');
        console.log(e);
      });
      request.end();
  } catch (e) {

  }
}

process.on('uncaughtException', (err) => {
  // console.log(err);
});