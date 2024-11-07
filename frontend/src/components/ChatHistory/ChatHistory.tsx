import React from "react";
import styled from "styled-components";
import { SpeechBubble } from "../SpeechBubble";
import { Message } from "../../stores/ChatStore";

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
    <div style={styles.chatHistory}>
      <h2 style={styles.h2}>
        Welcome to the chat room {username}. Type your messages below.
      </h2>
      {messages}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chatHistory: {
    backgroundColor: "#f7f7f7",
    margin: 0,
    padding: "20px",
  },
  h2: {
    margin: 0,
    padding: 0,
  },
};
