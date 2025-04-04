import { action, makeAutoObservable } from "mobx";
import { createContext } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { User } from "../api/chatApi";

export type Message = {
  body: string;
  username: string;
  timestamp: string;
  userId: number;
  recipientUsername: string;
  recipientId: number | null;
  conversationId: number;
  action?: string;
};

export type SubscribeMessage = {
  conversationId: number;
  action?: string;
};

type Conversation = {
  conversationId: number;
  lastMessage: string;
  lastMessageAt: string;
  isGroup: boolean;
  unreadCount: number;
  displayName: string;
};

interface CustomJwtPayload extends JwtPayload {
  username?: string;
  userId?: number;
}

class ChatStore {
  messages: Message[] = [];
  conversations: Conversation[] = [];
  socket: WebSocket | null = null;
  username: string = "";
  userId: number | null = null;
  recipientUsername: string = "";
  recipientId: number | null = null;
  groupName?: string;
  groupId?: number;
  password: string = "";
  jwt: string | null = null;
  isLoggedIn = false;
  isLoading = false;
  error: string | null = null;
  socketInitialised: boolean = false;

  constructor() {
    makeAutoObservable(this);
    // this.initializeUser();
  }

  initializeUser() {
    const token = localStorage.getItem("jwt");
    if (token) {
      this.jwt = token;
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const expiration = decoded.exp ? decoded.exp * 1000 : 0;

        if (Date.now() < expiration) {
          this.username = decoded.username || "";
          this.userId = decoded.userId || null;
          this.isLoggedIn = true;
        } else {
          localStorage.removeItem("jwtToken");
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
        localStorage.removeItem("jwtToken");
      }
    }
  }

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
    if (!this.socketInitialised) {
      this.socketInitialised = true;
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
            recipientId: receivedMessage.recipientId,
            recipientUsername: receivedMessage.recipientUsername,
            conversationId: receivedMessage.conversationId,
          },
        ];
        if (!this.recipientId || !this.recipientUsername) {
          this.recipientId = receivedMessage.userId;
          this.recipientUsername = receivedMessage.username;
        }
      };

      this.socket.onclose = (event) => {
        console.log("Socket Closed Connection: ", event);
      };

      this.socket.onerror = (error) => {
        console.log("Socket Error: ", error);
      };
    }
  };

  hydratePrivateMessages = async (conversationId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/hydratePrivateMessages?conversation_id=${conversationId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.jwt}`, // Pass JWT as a Bearer token in the Authorization header
          },
        }
      );
      const data = await response.json();
      const messages: Message[] = data.privateMessages.map((msg: any) => ({
        body: msg.body,
        username: msg.username,
        timestamp: new Date(msg.timestamp),
        userId: msg.userId,
        conversationId: msg.conversationId,
        recipientUsername: msg.recipientUsername,
        recipientId: msg.recipientId,
      }));
      this.messages = messages;
    } catch (error) {
      throw new Error("Error loading messages");
    }
  };

  // Add a new message and send it to the WebSocket server
  addPrivateMessage = (
    message: string,
    conversationId: number,
    recipientDetails: User
  ) => {
    if (this.userId && this.socket) {
      const msgObj: Message = {
        body: message,
        username: this.username,
        timestamp: new Date().toISOString(),
        userId: this.userId,
        recipientId: recipientDetails.userId,
        recipientUsername: recipientDetails.username,
        conversationId: conversationId,
      };

      console.log("message ", recipientDetails);
      this.socket.send(JSON.stringify(msgObj));
    }
  };

  subscribeToConversation = (conversationId: number) => {
    console.log("subscribing");
    if (this.socket) {
      const msgObj: SubscribeMessage = {
        conversationId,
        action: "subscribe",
      };

      this.socket.send(JSON.stringify(msgObj));
    }
  };

  setUsername = (username: string) => {
    this.username = username;
  };

  setRecipientDetails = (id: number, username: string) => {
    console.log("setting");
    this.recipientId = id;
    this.recipientUsername = username;
  };

  setUserId = (id: number) => {
    this.userId = id;
  };

  setPassword = (password: string) => {
    this.password = password;
  };
}

const chatStore = new ChatStore();
export default chatStore;

export const StoreContext = createContext<ChatStore | null>(null);
