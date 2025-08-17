import React, { useRef, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { SpeechBubble } from "./SpeechBubble";
import { Message } from "../../../types";

interface ChatHistoryProps {
  chatHistory: Message[];
  username: string;
}

export const ChatHistory = ({ chatHistory, username }: ChatHistoryProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        overflow: "auto",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
        {chatHistory.map((msg, index) => (
          <SpeechBubble
            key={index}
            body={msg.body}
            username={msg.username}
            currUsername={username}
            timestamp={msg.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
};
