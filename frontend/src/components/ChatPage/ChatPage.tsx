import React, { useEffect, useState } from "react";
import "./App.css";
import { Header, ChatHistory, ChatInput } from "./../";
import { connect, Message, sendMsg } from "../../api";

const ChatPage = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>();
  useEffect(() => {
    if (username) {
      connect((msg: MessageEvent) => {
        console.log(msg);
        setChatHistory([...chatHistory, { body: msg.data, username }]);
      });
    }
  }, [chatHistory, username]);

  const send = (event: any) => {
    if (event.keyCode === 13 && username) {
      sendMsg({ body: event.target.value, username });
      event.target.value = "";
    }
  };

  //   const createUsername = (event: any) => {
  //     if (event.keyCode === 13) {
  //       setUsername(event.target.value);
  //     }
  //   };

  return (
    <>
      <ChatHistory chatHistory={chatHistory} username={"tash"} />
      <ChatInput send={send} />
    </>
  );
};

export default ChatPage;
