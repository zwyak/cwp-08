const http = require('http');
const net = require('net');
const sport = 8124;

const client = new net.Socket();
client.setEncoding('utf8');

client.on('close', function() {
  console.log('Connection closed');
});

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
  '/workers/add': workersAdd,
  '/workers': workers
  //'/workers/remove': workerRemove
};

const server = http.createServer((req, res) => {
  parseBodyJson(req, (err, payload) => {
    const handler = getHandler(req.url);

    handler(req, res, payload, (err, result) => {
      if (err) {
        res.statusCode = err.code;
        res.setHeader('Content-Type', 'application/json');
        res.end( JSON.stringify(err) );

        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end( JSON.stringify(result) );
    });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
  return handlers[url] || notFound;
}

function workersAdd(req, res, payload, cb) {
  client.connect(sport, function() {
    console.log('Connected');
    client.write(`/process/create ${payload.dir} ${payload.x}`);
  });

  client.on('data', function(data) {
    console.log(data);
    cb(null, {data: data});
  });

}

function workers(req, res, payload, cb) {
  client.connect(sport, function() {
    console.log('Connected');
    client.write('/process/list');
  });

  client.on('data', function(data) {
    console.log(data);
    cb(null, {data: data});
  });
}

function notFound(req, res, payload, cb) {
  cb({ code: 404, message: 'Not found'});
}

function parseBodyJson(req, cb) {
  let body = [];

  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    let params = JSON.parse(body);

    cb(null, params);
  });
}
