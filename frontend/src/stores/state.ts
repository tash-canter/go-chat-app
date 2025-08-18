import { create } from "zustand";

type ChatState = {
  username: string | null;
  userID: number | null;
  recipientUsername: string | null;
  recipientID: number | null;
  isLoggedIn: boolean;
  currentView: "auth" | "chat";
  setAuth: (username: string, userID: number) => void;
  setRecipient: (recipientUsername: string, recipientUserID: number) => void;
  setCurrentView: (view: "auth" | "chat") => void;
  resetRecipient: () => void;
  logout: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  username: null,
  userID: null,
  recipientUsername: null,
  recipientID: null,
  isLoggedIn: false,
  currentView: "auth",
  setAuth: (username: string, userID: number) =>
    set({ username, userID, isLoggedIn: true, currentView: "chat" }),
  setRecipient: (recipientUsername: string, recipientID: number) =>
    set({ recipientUsername, recipientID }),
  setCurrentView: (view: "auth" | "chat") => set({ currentView: view }),
  resetRecipient: () => set({ recipientUsername: null, recipientID: null }),
  logout: () =>
    set({
      username: null,
      userID: null,
      isLoggedIn: false,
      recipientID: null,
      recipientUsername: null,
      currentView: "auth",
    }),
}));
