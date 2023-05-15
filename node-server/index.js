var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var serialPort = new SerialPort({
  path: "/dev/cu.usbmodem1102",
  baudRate: 115200,
});
serialPort.on("open", function () {
  console.log("open");
  serialPort.on("data", function (data) {
    if (data) console.log(data.toString());
  });
});
