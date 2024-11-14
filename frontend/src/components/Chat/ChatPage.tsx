import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../stores/ChatStore";
import { ChatHistory, ChatInput } from "./components";
import { useNavigate } from "react-router-dom";

export const ChatPage = observer(() => {
  const chatStore = useContext(StoreContext);
  if (!chatStore) {
    throw new Error("StoreContext must be used within a StoreContext.Provider");
  }
  const { username, addMessage, messages, initializeSocket, isLoggedIn } =
    chatStore;
  const navigate = useNavigate();
  useEffect(() => {
    initializeSocket();
    if (isLoggedIn === false) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const send = (event: any) => {
    if (event.keyCode === 13) {
      addMessage(event.target.value);
      event.target.value = "";
      console.log("SENDING");
    }
  };

  return (
    <>
      <ChatHistory chatHistory={messages} username={username} />
      <ChatInput send={send} />
    </>
  );
});
