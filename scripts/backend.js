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
    wss.clients.forEach(function each (client) {
      // Send to All
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        // Send to All But Origin
        // console.log("client client client client client client client client :",client) 
        // console.log('ws:',ws)
        console.log("ws ws ws ws ws ws ws ws ws ws ws ws ws ws ws ws ws ws",ws)
        if (client == ws) {
          // console.log("same same same same same same same same same ")
          return;
          // {same: 'same'}
          // client.send(message, { binary: isBinary });
        }
        else if(client != ws) {
          // console.log("different different different different different different different different ")
          client.send(message, { binary: isBinary})
        // if(client !== ws && client.readyState === WebSocket.OPEN) {


        // console.log(message);
        // client.send(message, { binary: isBinary });

        //! This will reference the commonly shared object
        // client.send(message, {binary: isBinary})
        // client.send("" + message)
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
