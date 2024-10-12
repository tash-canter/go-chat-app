import React from "react";
import styled from "styled-components";
import { SpeechBubble } from "../SpeechBubble";
import { Message } from "../../api";

interface ChatHistoryProps {
  chatHistory: Message[];
  username: string;
}

export const ChatHistory = ({ chatHistory, username }: ChatHistoryProps) => {
  const messages = chatHistory.map((msg, index) => {
    const json = JSON.parse(msg.body);
    return (
      <SpeechBubble
        key={index}
        body={json.body}
        username={json.Username}
        currUsername={username}
      />
    );
  });

  return (
    <StyledChatHistory>
      <h2>Welcome to the chat room {username}. Type your messages below.</h2>
      {messages}
    </StyledChatHistory>
  );
};

const StyledChatHistory = styled("div")`
  background-color: #f7f7f7;
  margin: 0;
  padding: 20px;
  h2 {
    margin: 0;
    padding: 0;
  }
`;
