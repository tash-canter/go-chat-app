import React, { useContext, useEffect } from "react";
import { ChatHistory, ChatInput } from "./../";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../stores/ChatStore";
export const ChatPage = observer(() => {
  const chatStore = useContext(StoreContext);
  if (!chatStore) {
    throw new Error("StoreContext must be used within a StoreContext.Provider");
  }
  const { username, addMessage, messages, initializeSocket } = chatStore;
  useEffect(() => {
    initializeSocket();
  }, []);

  const send = (event: any) => {
    if (event.keyCode === 13) {
      addMessage(event.target.value);
      event.target.value = "";
    }
  };

  return (
    <>
      <ChatHistory chatHistory={messages} username={username} />
      <ChatInput send={send} />
    </>
  );
});
