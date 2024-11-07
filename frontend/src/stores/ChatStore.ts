import { action, makeAutoObservable, observable } from "mobx";
import { createContext } from "react";

export type Message = {
  body: string;
  username: string;
  timeStamp: string;
};

class ChatStore {
  messages: Message[] = [];
  currentMessage: string = "";
  socket: WebSocket | null = null;
  username: string = "";
  password: string = "";
  jwt: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadToken();
  }

  setToken = (token: string) => {
    this.jwt = token;
    localStorage.setItem("jwt", token); // Persist the token
  };

  loadToken() {
    const token = localStorage.getItem("jwt");
    if (token) {
      this.jwt = token; // Load the token into the store
    }
  }

  clearToken() {
    this.jwt = null;
    localStorage.removeItem("jwt"); // Remove the token from storage
  }

  // Initialize WebSocket connection
  initializeSocket = () => {
    this.socket = new WebSocket("ws://localhost:8080/ws");

    this.socket.onmessage = (event: MessageEvent) => {
      const receivedMessage = JSON.parse(event.data) as Message;
      this.messages.push({
        body: receivedMessage.body,
        username: receivedMessage.username,
        timeStamp: new Date().toLocaleTimeString(),
      });
    };

    this.socket.onclose = (event) => {
      console.log("Socket Closed Connection: ", event);
    };

    this.socket.onerror = (error) => {
      console.log("Socket Error: ", error);
    };
  };

  // Add a new message and send it to the WebSocket server
  addMessage(message: string) {
    const msgObj: Message = {
      body: message,
      username: this.username,
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

  setUsername = (username: string) => {
    this.username = username;
  };

  setPassword = (password: string) => {
    this.password = password;
  };
}

const chatStore = new ChatStore();
export default chatStore;

export type RootStoreType = {
  chatStore: ChatStore;
};

// Create context with default value
export const RootStoreContext = createContext<RootStoreType | null>(null);
