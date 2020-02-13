// tcp-server.js
const net = require('net');
const path = require('path');
const { execFile } = require('child_process');

const port = 8124;

const server = net.createServer((client) => {
  console.log('Client connected');

  client.setEncoding('utf8');

  client.on('data', (data) => {
    console.log(data);
    client.write('\r\nHello!\r\nRegards,\r\nServer\r\n');
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
