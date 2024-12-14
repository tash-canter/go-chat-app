import React from "react";
import { Message } from "../../../stores/ChatStore";
import { SpeechBubble } from "./SpeechBubble";

interface ChatHistoryProps {
  chatHistory: Message[];
  username: string;
  recipientUsername?: string;
}

export const ChatHistory = ({
  chatHistory,
  username,
  recipientUsername,
}: ChatHistoryProps) => {
  const messages = chatHistory.map((msg, index) => {
    return (
      <SpeechBubble
        key={index}
        body={msg.body}
        username={msg.username}
        currUsername={username}
        timestamp={msg.timestamp}
      />
    );
  });

  return (
    <div style={styles.chatHistory}>
      <h2 style={styles.h2}>
        {recipientUsername
          ? `Chatting with ${recipientUsername}. Type your messages below.`
          : `Welcome to the chat room ${username}. Please choose someone to chat with.`}
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
