// require("dotenv").config();

// -------------------------------------- Express Section ---------------------------------------
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const PORT = 3400;

const wss = new WebSocket.Server({ server: server });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.send("Welcome new client");

  ws.on("message", (message, isBinary) => {
    // Broadcast the message to every connected client
    wss.clients.forEach(function each(client) {
      // Send to All
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        // Send to All But Origin not working... using randomly generated id on the front end

        if (client === ws) {
          return;
        } else if (client !== ws) {
          client.send(message, { binary: isBinary });
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
