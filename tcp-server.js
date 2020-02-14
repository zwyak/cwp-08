// tcp-server.js
const net = require('net');
const path = require('path');
const spawn = require('child_process').spawn;

const port = 8124;

let workers = [];

const server = net.createServer((client) => {
  console.log('Client connected');

  client.setEncoding('utf8');

  client.on('data', (data) => {
    const req = data.split(' ');
    console.log(`Request: ${data}`);

    switch (req[0]) {
      case '/process/create':
        const fileName = Date.now().toSting();
        const child = spawn(`node ${path.join(req[1], fileName)} ${req[2]}`, {detached:true});
        workers.push(child);
        client.write(`Process ${child.pid} was started`);
        break;
      case '/process/list':
        let processList = '';
        workers.forEach((item, i) => {
          processList += item.pid.toString() + '\r\n'
        });
        client.write(processList);
        break;
      case '/process/kill':
        let flag = false;
        workers.forEach((item, i) => {
          if (item.pid == req[1]) flag = true;
        });
        if (flag == false){
          client.write(`Process ${req[1]} wasn't found`);
          break;
        }
        process.kill(req[1]);
        client.write(`Process ${req[1]} was stoped`);
        break;
      default:
        client.write('Bad Request');
        client.destroy();
        break;
    }
    client.write('\r\nHello!\r\nRegards,\r\nServer\r\n');
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
