#!/usr/bin/env node

const io = require('socket.io-client');

let counter = 0;
let host = process.argv[2];

if (!host) {
  console.error('Host not found! usage: bin/docker/node/websocket <hostname>');
  return;
}

host = host
  .replace("\r", '')
  .replace("\n", '')

let timeout = setTimeout(_timeout, 1000);
let interval = setInterval(_interval, 10);

function _timeout() {
  console.log('[WEBSOCKET] Timeout');
  clearInterval(interval);
  process.exit(1);
}

async function _interval() {
  
  console.log('[WEBSOCKET] Try connect server', {
    host
  });

  const socket = io(`ws://${host}`);

  socket.on('system_error', (error) => {
    counter++
    const obj = JSON.parse(error)
    if (obj.message == 'server_many_connections') {
      console.log(`[WEBSOCKET] Success block on try flood [${counter}]`);
      clearInterval(interval);
      clearTimeout(timeout);
      process.exit(0);
    }
  })
}

process.on('uncaughtException', (err) => {
  console.log(err)
});