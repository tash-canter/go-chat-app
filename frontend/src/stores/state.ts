import { create } from "zustand";

type ChatState = {
  username: string | null;
  userID: number | null;
  recipientUsername: string | null;
  recipientID: number | null;
  isLoggedIn: boolean;
  setAuth: (username: string, userID: number) => void;
  setRecipient: (recipientUsername: string, recipientUserID: number) => void;
  logout: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  username: null,
  userID: null,
  recipientUsername: null,
  recipientID: null,
  isLoggedIn: false,
  setAuth: (username: string, userID: number) =>
    set({ username, userID, isLoggedIn: true }),
  setRecipient: (recipientUsername: string, recipientID: number) =>
    set({ recipientUsername, recipientID }),
  logout: () =>
    set({
      username: null,
      userID: null,
      isLoggedIn: false,
      recipientID: null,
      recipientUsername: null,
    }),
}));
