import React, { useState } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { useChatStore } from "../../../stores/state";

interface SearchResult {
  userID: string;
  username: string;
}

interface SearchSidebarProps {
  onSearch: (query: string) => void;
  searchResults: Array<SearchResult>;
  isLoading: boolean;
  selectedUserID: Number;
}

export const SearchSidebar = ({
  onSearch,
  searchResults,
  isLoading,
  selectedUserID,
}: SearchSidebarProps) => {
  const [localQuery, setLocalQuery] = useState("");
  const { setRecipient } = useChatStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalQuery(newValue);
    onSearch(newValue);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bottom: 100,
      }}
    >
      <Box
        sx={{
          height: "100vh", // full screen height
          display: "flex",
          justifyContent: "center", // centre vertically
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/assets/TalkWithTash.png"
          alt="Logo"
          style={{ height: 200, width: "auto", marginBottom: 10 }}
        />
        <TextField
          fullWidth
          placeholder="Search users to start a conversation..."
          sx={{
            width: "75vw",
            maxWidth: "600px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
            },
          }}
          variant="outlined"
          value={localQuery}
          onChange={handleChange}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: "auto" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : searchResults.length > 0 ? (
          <List>
            {searchResults.map((result) => (
              <ListItem key={result.userID} disablePadding>
                <ListItemButton
                  selected={selectedUserID === Number(result.userID)}
                  key={result.userID}
                  onClick={() =>
                    setRecipient(result.username, Number(result.userID))
                  }
                >
                  <PersonIcon sx={{ mr: 2 }} />
                  <ListItemText primary={result.username} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : localQuery ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">No users found</Typography>
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              Search for users to start a conversation
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
