// Import static server plugin
var staticServer = require("static-server");

// Create new static server with root path & port
var server = new staticServer({
  rootPath: "./dist/",
  port: 8000
});

// Create function for show message when server open
server.start(function () {
  console.log("Server started at port", server.port);
});