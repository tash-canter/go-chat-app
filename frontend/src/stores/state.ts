import { create } from "zustand";
import { connectWebSocket, isWebSocketConnected } from "../utils/websocket";

const updateURLParams = (
  recipientUsername: string | null,
  recipientID: number | null
) => {
  const url = new URL(window.location.href);
  if (recipientUsername && recipientID) {
    url.searchParams.set("chat", recipientUsername);
    url.searchParams.set("id", recipientID.toString());
  } else {
    url.searchParams.delete("chat");
    url.searchParams.delete("id");
  }
  window.history.replaceState({}, "", url.toString());
};

const getURLParams = () => {
  const url = new URL(window.location.href);
  const chat = url.searchParams.get("chat");
  const id = url.searchParams.get("id");
  return { chat, id };
};

type ChatState = {
  username: string | null;
  userID: number | null;
  isLoggedIn: boolean;
  recipientUsername: string | null;
  recipientID: number | null;
  currentView: "auth" | "search" | "chat";
  isLoading: boolean;
  setAuth: (username: string, userID: number) => void;
  setRecipient: (recipientUsername: string, recipientID: number) => void;
  setCurrentView: (view: "auth" | "search" | "chat") => void;
  setLoading: (loading: boolean) => void;
  resetRecipient: () => void;
  logout: () => void;
  restoreFromURL: (users?: any[]) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  username: null,
  userID: null,
  recipientUsername: null,
  recipientID: null,
  isLoggedIn: false,
  currentView: "auth",
  isLoading: true,
  setAuth: (username: string, userID: number) => {
    set({
      username,
      userID,
      isLoggedIn: true,
      currentView: "search",
      isLoading: false,
    });

    if (!isWebSocketConnected()) {
      connectWebSocket();
    }
  },
  setRecipient: (recipientUsername: string, recipientID: number) => {
    set({ recipientUsername, recipientID, currentView: "chat" });
    updateURLParams(recipientUsername, recipientID);
  },
  setCurrentView: (view: "auth" | "search" | "chat") =>
    set({ currentView: view }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  resetRecipient: () => {
    set({ recipientUsername: null, recipientID: null });
    updateURLParams(null, null);
  },
  logout: () => {
    updateURLParams(null, null);

    set({
      username: null,
      userID: null,
      isLoggedIn: false,
      recipientID: null,
      recipientUsername: null,
      currentView: "auth",
      isLoading: false,
    });
  },
  restoreFromURL: (users?: any[]) => {
    const { chat, id } = getURLParams();
    if (chat && id && users && users.length > 0) {
      const user = users.find((user: any) => user.username === chat);

      if (user && user.userID === parseInt(id, 10)) {
        set({
          recipientUsername: chat,
          recipientID: parseInt(id, 10),
          currentView: "chat",
        });
      } else {
        updateURLParams(null, null);
        set({ currentView: "search" });
      }
    }
  },
}));
