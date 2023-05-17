const express = require("express");

const app = express();
const server = require("http").createServer(app);

const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

// socket.io
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

server.listen(3000, function () {
  console.log("Server listening");
});

const serialPort = new SerialPort({
  path: "/dev/cu.usbmodem1102",
  baudRate: 115200,
  parity: "none",
}).setEncoding("utf8");

io.on("connection", function (socket) {
  serialPort
    .pipe(new ReadlineParser({ delimiter: "\r\n" }))
    .on("data", function (data) {
      try {
        const json = JSON.parse(data);
        if (json) {
          socket.emit("serial", json.tilt);
        }
      } catch (e) {}
    });
});
