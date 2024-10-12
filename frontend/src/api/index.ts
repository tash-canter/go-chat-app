// api/index.js
var socket = new WebSocket("ws://localhost:8080/ws");

export interface Message {
  username: string;
  body: string;
}

const connect = (cb: any) => {
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = (msg) => {
    cb(msg);
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };
};

const sendMsg = (msg: Message) => {
  console.log("sending msg: ", msg);
  socket.send(JSON.stringify(msg));
};

export { connect, sendMsg };
