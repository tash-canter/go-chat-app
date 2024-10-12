import { makeAutoObservable } from "mobx";

type Message = {
  text: string;
  timeStamp: string;
};

class ChatStore {
  messages: Message[] = [];
  currentMessage: string = "";
  socket: WebSocket | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeSocket();
  }

  // Initialize WebSocket connection
  initializeSocket() {
    this.socket = new WebSocket("ws://localhost:8080/ws");

    this.socket.onmessage = (event: MessageEvent) => {
      const receivedMessage = JSON.parse(event.data) as Message;
      this.messages.push({
        text: receivedMessage.text,
        timeStamp: new Date().toLocaleTimeString(),
      });
    };
  }

  // Add a new message and send it to the WebSocket server
  addMessage(message: string) {
    const msgObj: Message = {
      text: message,
      timeStamp: new Date().toLocaleTimeString(),
    };

    if (this.socket) {
      this.socket.send(JSON.stringify(msgObj));
    }
    this.messages.push(msgObj); // Add to the local store
    this.currentMessage = ""; // Clear current message
  }

  // Set the current message being typed
  setCurrentMessage(message: string) {
    this.currentMessage = message;
  }
}

const chatStore = new ChatStore();
export default chatStore;
