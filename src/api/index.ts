// api/index.js
var socket = new WebSocket("ws://localhost:8080/ws");

export interface Message {
  username: string;
  body: string;
}

const createSocket = (username: string) => {
  return new WebSocket(`ws://localhost:8080/ws?username=${username}`);
};

const connect = (cb: any) => {
  // const socket = createSocket(username);

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
  // const socket = createSocket(username);
  console.log("sending msg: ", msg);
  socket.send(JSON.stringify(msg));
};

export { connect, sendMsg };
