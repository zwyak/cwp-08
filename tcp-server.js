// tcp-server.js
const net = require('net');
const path = require('path');
const child_process = require('child_process');

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
        const fileName = Date.now();
        const child = child_process.exec(`node worker.js ${path.join(req[1], fileName + '.json')} ${req[2]}`, (error, stdout, stderr) => {
          if (error) throw error;
        });
        workers.push(child);
        client.write(`Process ${child.pid} was started`);
        client.destroy();
        break;
      case '/process/list':
        let processList = '';
        workers.forEach((item, i) => {
          processList += item.pid.toString() + ' '
        });
        client.write(processList);
        client.destroy();
        break;
      case '/process/kill':
        let flag = false;
        let index = 0;
        workers.forEach((item, i) => {
          if (item.pid == req[1]){
            flag = true;
            index = i;
          }
        });
        if (flag == false){
          client.write(`Process ${req[1]} wasn't found`);
          client.destroy();
          break;
        }
        process.kill(req[1]);
        workers.splice(index, 1);
        client.write(`Process ${req[1]} was stoped`);
        client.destroy();
        break;
      default:
        client.write('Bad Request');
        client.destroy();
        break;
    }
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
