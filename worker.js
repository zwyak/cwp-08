const fs = require('fs');
const file = process.argv[2];
const x = process.argv[3];

fs.writeFile(file, '', (err) => {
  if (err) throw err;
  console.log('The file has been created!');
});

function writeFile(){
  const number = Date.now();
  const json = JSON.stringify({number:number});

  fs.appendFile(file, json + '\r\n', (err) => {
    if (err) throw err;
    console.log('The "data to append" was appended to file!');
  });
}

setInterval(writeFile, x);
