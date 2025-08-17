import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  send: (message: string) => void;
}

export const ChatInput = ({ send }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      send(message);
      console.log("send", message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        backgroundColor: "background.paper",
        display: "flex",
        alignItems: "center",
      }}
    >
      <TextField
        fullWidth
        placeholder="Type a message..."
        variant="outlined"
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        onKeyDown={handleKeyDown}
        autoFocus
        sx={{ mr: 1 }}
      />
      <IconButton color="primary" type="submit" aria-label="send">
        <SendIcon />
      </IconButton>
    </Box>
  );
};
