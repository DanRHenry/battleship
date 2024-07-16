// require("dotenv").config();

// -------------------------------------- Express Section ---------------------------------------
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const PORT = 3400;

const wss = new WebSocket.Server({ server: server });

// let obj = { key0: "value0", key1: "value1" };
// obj = obj;

wss.on("connection", function connection(ws) {
  console.log("Hello! A new client connected");
  ws.send("Welcome new client");

  //   ws.on("message", (message, isBinary) => {
  ws.on("message", (message, isBinary) => {
    // Broadcast the message to every connected client
    wss.clients.forEach(function each(client) {
      // Send to All
      if (client.readyState === WebSocket.OPEN) {
        // Send to All But Origin
        if(client !== ws && client.readyState === WebSocket.OPEN) {
        // console.log(message);
        // client.send(message, { binary: isBinary });

        //! This will reference the commonly shared object
        client.send("" + message)
        // client.send(JSON.stringify(obj.key0), {binary: isBinary})
      }
    }
    });
  });
  ws.on("close", () => {
    console.log("connection closed");
  });
});

server.listen(PORT, () =>
  console.log(`The websocket server is running on Port: ${PORT}`)
);
