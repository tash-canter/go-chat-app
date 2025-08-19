import React from "react";
import { Box, IconButton, Typography, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { ChatHistory, ChatInput } from "./components";
import { useWebSocket } from "../../api/useWebsocket";
import { useChatStore } from "../../stores/state";
import { LogoutUser } from "../LogoutUser";

export const ChatPage = () => {
  const { recipientUsername, username, setCurrentView, resetRecipient } =
    useChatStore();
  const { messages, sendMessage } = useWebSocket();

  if (!username || !recipientUsername) {
    return null;
  }

  const handleBackToSearch = () => {
    resetRecipient();
    setCurrentView("search");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          borderBottom: 1,
          borderColor: "divider",
          flexShrink: 0,
          backgroundColor: "grey.50",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleBackToSearch} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 500,
              color: "text.primary",
              fontSize: "1.1rem",
              letterSpacing: "0.5px",
            }}
          >
            Chat with {recipientUsername}
          </Typography>
        </Box>

        <LogoutUser size="small" />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          backgroundColor: "background.default",
        }}
      >
        <ChatHistory chatHistory={messages} username={username} />
        <Divider />
        <ChatInput send={sendMessage} />
      </Box>
    </Box>
  );
};
