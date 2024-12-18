import { action, makeAutoObservable } from "mobx";
import { createContext } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

export type Message = {
  body: string;
  username: string;
  timestamp: string;
  userId: number;
  recipientId?: number;
  recipientUsername?: string;
  groupId?: number;
  groupName?: string;
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
  recipientUsername?: string;
  recipientId?: number;
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
          this.hydratePrivateMessages();
        } else {
          localStorage.removeItem("jwtToken");
        }
      } catch (error) {
        console.error("Failed to decode JWT:", error);
        localStorage.removeItem("jwtToken");
      }
    }
  }

  hydratePrivateMessages = async () => {
    this.isLoading = true;
    try {
      const response = await fetch(
        `http://localhost:8080/api/hydratePrivateMessages?recipient_id=${this.recipientId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.jwt}`, // Pass JWT as a Bearer token in the Authorization header
          },
        }
      );
      const data = await response.json();
      this.messages = data.privateMessages; // Assuming the backend returns an array of messages
    } catch (error) {
      this.error = "Error loading messages";
    } finally {
      this.isLoading = false;
    }
  };

  hydrateConversations = async () => {
    this.isLoading = true;
    try {
      const response = await fetch(
        `http://localhost:8080/api/hydrateConversations`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.jwt}`, // Pass JWT as a Bearer token in the Authorization header
          },
        }
      );
      const data = await response.json();
      this.conversations = data.conversations; // Assuming the backend returns an array of messages
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
            groupId: receivedMessage.groupId,
            groupName: receivedMessage.groupName,
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

  // Add a new message and send it to the WebSocket server
  addPrivateMessage = (message: string) => {
    if (this.userId && this.socket) {
      const msgObj: Message = {
        body: message,
        username: this.username,
        timestamp: new Date().toISOString(),
        userId: this.userId,
        recipientId: this.recipientId,
        recipientUsername: this.recipientUsername,
      };

      this.socket.send(JSON.stringify(msgObj));
    }
  };

  subscribeToGroup = () => {
    if (this.socket && this.userId) {
      const msgObj: Message = {
        body: "",
        username: this.username,
        timestamp: new Date().toISOString(),
        userId: this.userId,
        groupId: this.groupId,
        groupName: this.groupName,
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
