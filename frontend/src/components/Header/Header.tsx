import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../stores/state";

export const Header = () => {
  const { logout, recipientUsername, isLoggedIn } = useChatStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <ChatIcon sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {recipientUsername
            ? `chatting with ${recipientUsername}`
            : "Tash's Chat App"}
        </Typography>
        {isLoggedIn && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
