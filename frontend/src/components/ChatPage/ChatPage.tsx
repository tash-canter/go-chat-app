import React, { useContext, useEffect, useState } from "react";
import { Header, ChatHistory, ChatInput } from "./../";
import { connect, sendMsg } from "../../api";
import chatStore, { RootStoreContext } from "../../stores/ChatStore";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../stores/StoreContext";

export const ChatPage = observer(() => {
  const chatStore = useContext(StoreContext);
  const {
    username,
    addMessage,
    setCurrentMessage,
    messages,
    initializeSocket,
  } = chatStore;
  useEffect(() => {
    initializeSocket();
  }, []);

  const send = (event: any) => {
    if (event.keyCode === 13 && username) {
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
