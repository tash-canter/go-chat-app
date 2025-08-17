import React, { useContext, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import debounce from "lodash/debounce";
import { Box, Paper, Divider } from "@mui/material";

import { ChatHistory, ChatInput, SearchSidebar } from "./components";
import { useWebSocket } from "../../api/useWebsocket";
import { useChatStore } from "../../stores/state";
import { useSearchUsers } from "../../api/queries";

export const ChatPage = () => {
  const { recipientID, recipientUsername, username } = useChatStore();

  const { messages, sendMessage } = useWebSocket();
  const [query, setQuery] = useState("");
  const { data, isLoading } = useSearchUsers(query);

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setQuery(value), 300),
    []
  );

  const handleSearch = (queryString: string) => {
    debouncedSetQuery(queryString);
  };

  console.log(username, recipientUsername);

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          borderRadius: 0,
        }}
      >
        {username && recipientUsername && (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "75%",
            }}
          >
            <ChatHistory chatHistory={messages} username={username} />
            <Divider />
            <ChatInput send={sendMessage} />
          </Box>
        )}

        <Divider orientation="vertical" flexItem />

        {!recipientID && (
          <Box sx={{ width: "100%", height: "100%" }}>
            <SearchSidebar
              onSearch={handleSearch}
              searchResults={data ? data.users : []}
              isLoading={isLoading}
              selectedUserID={recipientID ?? 0}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};
