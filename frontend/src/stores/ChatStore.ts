import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

export type Message = {
  body: string;
  username: string;
  timestamp: string;
  userId: Number;
};

interface CustomJwtPayload extends JwtPayload {
  username?: string;
  userId?: Number;
}

class ChatStore {
  messages: Message[] = [];
  socket: WebSocket | null = null;
  username: string = "";
  userId: Number | null = null;
  password: string = "";
  jwt: string | null = null;
  isLoggedIn = false;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeUser();
  }

  initializeUser() {
    const token = localStorage.getItem("jwt");
    if (token) {
      this.jwt = token;
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const expiration = decoded.exp ? decoded.exp * 1000 : 0; // Convert to milliseconds

        if (Date.now() < expiration) {
          this.username = decoded.username || ""; // assuming "username" is in the payload
          this.userId = decoded.userId || null;
          this.isLoggedIn = true;
          this.hydrateMessages();
        } else {
          localStorage.removeItem("jwtToken"); // Remove expired token
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
        localStorage.removeItem("jwtToken");
      }
    }
  }

  hydrateMessages = async () => {
    this.isLoading = true;
    try {
      const response = await fetch(
        "http://localhost:8080/api/hydrateMessages",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.jwt}`, // Pass JWT as a Bearer token in the Authorization header
          },
        }
      );
      const data = await response.json();
      this.messages = data.messages; // Assuming the backend returns an array of messages
    } catch (error) {
      this.error = "Error loading messages";
    } finally {
      this.isLoading = false;
    }
  };

  setToken = (token: string) => {
    this.jwt = token;
    localStorage.setItem("jwt", token); // Persist the token
  };

  clearToken() {
    this.jwt = null;
    localStorage.removeItem("jwt"); // Remove the token from storage
  }

  setIsLoggedIn = (isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
  };

  // Initialize WebSocket connection
  initializeSocket = () => {
    if (!this.jwt) {
      this.setIsLoggedIn(false);
    }
    this.socket = new WebSocket(`ws://localhost:8081/ws?token=${this.jwt}`);

    this.socket.onmessage = (event: MessageEvent) => {
      const receivedMessage = JSON.parse(event.data) as Message;
      this.messages = [
        ...this.messages,
        {
          body: receivedMessage.body,
          username: receivedMessage.username,
          userId: receivedMessage.userId,
          timestamp: receivedMessage.timestamp,
        },
      ];
    };

    this.socket.onclose = (event) => {
      console.log("Socket Closed Connection: ", event);
    };

    this.socket.onerror = (error) => {
      console.log("Socket Error: ", error);
    };
  };

  // Add a new message and send it to the WebSocket server
  addMessage = (message: string) => {
    if (this.userId && this.socket) {
      const msgObj: Message = {
        body: message,
        username: this.username,
        timestamp: new Date().toISOString(),
        userId: this.userId,
      };

      this.socket.send(JSON.stringify(msgObj));
    }
  };

  setUsername = (username: string) => {
    this.username = username;
  };

  setPassword = (password: string) => {
    this.password = password;
  };
}

const chatStore = new ChatStore();
export default chatStore;

export const StoreContext = createContext<ChatStore | null>(null);
