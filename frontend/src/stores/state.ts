import { create } from "zustand";

type ChatState = {
  username: string | null;
  userID: number | null;
  recipientUsername: string | null;
  recipientID: number | null;
  isLoggedIn: boolean;
  currentView: "auth" | "chat";
  isLoading: boolean;
  setAuth: (username: string, userID: number) => void;
  setRecipient: (recipientUsername: string, recipientUserID: number) => void;
  setCurrentView: (view: "auth" | "chat") => void;
  setLoading: (loading: boolean) => void;
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
  isLoading: true,
  setAuth: (username: string, userID: number) =>
    set({
      username,
      userID,
      isLoggedIn: true,
      currentView: "chat",
      isLoading: false,
    }),
  setRecipient: (recipientUsername: string, recipientID: number) =>
    set({ recipientUsername, recipientID }),
  setCurrentView: (view: "auth" | "chat") => set({ currentView: view }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  resetRecipient: () => set({ recipientUsername: null, recipientID: null }),
  logout: () =>
    set({
      username: null,
      userID: null,
      isLoggedIn: false,
      recipientID: null,
      recipientUsername: null,
      currentView: "auth",
      isLoading: false,
    }),
}));
