const fs = require("fs");
const http = require("http");
const url = require("url");
const bufferSize = 512;
var buffer = new Buffer.alloc(bufferSize);
let filePosition = 0;
let lastCommand = "front";

let fd;

console.log("Open existing file");

function openFile() {
  return new Promise((resolve, reject) => {
    fs.open("example.txt", "r", function (err, fd) {
      if (err) {
        reject(err);
      }
      resolve(fd);
    });
  });
}

function readFile(fd, fp) {
  return new Promise((resolve, reject) => {
    fs.read(fd, buffer, 0, buffer.length, fp, function (err, bytes) {
      if (err) {
        reject(err);
      }
      console.log("Reading...");
      console.log(buffer.length);
      if (bytes > 0) {
        resolve(buffer.slice(0, bytes).toString());
      }
      console.log(bytes + " bytes read");
    });
  });
}

openFile().then((res) => {
  fd = res;
  console.log(fd);
});

const server = http.createServer(async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  if (queryObject.log == "back") {
    if (filePosition == 0) {
      res.end("Alredy reached start of file. Cannot go back");
      return;
    }
    if (lastCommand == "front") {
      filePosition = filePosition - 2 * bufferSize;
    } else {
      filePosition = filePosition - bufferSize;
    }
  }
  console.log("filePosition before execution::: " + filePosition);
  let fileOutput;
  fileOutput = await readFile(fd, filePosition);

  if (queryObject.log == "front") {
    if (lastCommand == "back") {
      filePosition = filePosition + 2 * bufferSize;
    } else {
      filePosition = filePosition + bufferSize;
    }
  }
  lastCommand = queryObject.log;
  console.log("filePosition after execution::: " + filePosition);
  // read next 1KB log and return response
  res.writeHead(200, { "Content-type": "text/html" });
  res.end(fileOutput);
});

server.listen(8080, "127.0.0.1", () => {
  console.log("Listening for requests now");
});
