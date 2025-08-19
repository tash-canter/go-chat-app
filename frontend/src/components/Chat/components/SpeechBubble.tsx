import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface SpeechBubbleProps {
  currUsername: string;
  timestamp: string;
  username: string;
  body: string;
}

export const SpeechBubble = ({
  username,
  body,
  currUsername,
  timestamp,
}: SpeechBubbleProps) => {
  const isFromCurrentUser = currUsername === username;
  const formattedTimestamp = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
        mb: 2,
        animation: "fadeInSlideUp 0.3s ease-out",
        "@keyframes fadeInSlideUp": {
          "0%": {
            opacity: 0,
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: "70%",
          backgroundColor: isFromCurrentUser ? "primary.main" : "grey.200",
          color: isFromCurrentUser ? "white" : "text.primary",
          borderRadius: isFromCurrentUser
            ? "16px 16px 0px 16px"
            : "16px 16px 16px 0px",
          position: "relative",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {username}
        </Typography>

        <Typography variant="body1">{body}</Typography>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "right",
            mt: 1,
            color: isFromCurrentUser
              ? "rgba(255, 255, 255, 0.7)"
              : "text.secondary",
          }}
        >
          {formattedTimestamp}
        </Typography>
      </Paper>
    </Box>
  );
};
