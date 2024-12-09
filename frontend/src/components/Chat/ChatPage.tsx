import React, { useContext, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../stores/ChatStore";
import { ChatHistory, ChatInput, SearchSidebar } from "./components";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";

export const ChatPage = observer(() => {
  const chatStore = useContext(StoreContext);
  if (!chatStore) {
    throw new Error("StoreContext must be used within a StoreContext.Provider");
  }
  const {
    username,
    jwt,
    addMessage,
    messages,
    initializeSocket,
    isLoggedIn,
    setRecipientDetails,
    recipientId,
    recipientUsername,
  } = chatStore;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      initializeSocket();
    } else {
      navigate("/");
    }
  }, [isLoggedIn]);

  const sendMessage = (event: any) => {
    if (event.keyCode === 13) {
      addMessage(event.target.value);
      event.target.value = "";
    }
  };

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value);
      }, 300),
    []
  );

  // Fetch function for querying users
  const fetchUsers = async (query: string) => {
    const response = await fetch(
      `http://localhost:8080/api/searchUsers?username=${query}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`, // Pass JWT as a Bearer token in the Authorization header
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: async () => await fetchUsers(query),
    enabled: !!query, // Only execute when query has a value
  });

  const handleSearch = (queryString: string) => {
    debouncedSetQuery(queryString);
  };

  const handleSelectUser = (id: Number, username: string) => {
    setRecipientDetails(id, username);
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatSection}>
        <ChatHistory
          chatHistory={messages}
          username={username}
          recipientUsername={recipientUsername}
        />
        <ChatInput send={sendMessage} />
      </div>
      <SearchSidebar
        onSearch={handleSearch}
        searchResults={data ? data.users : []}
        onSelectUser={handleSelectUser}
        isLoading={isLoading}
        selectedUserId={recipientId ?? 0}
      />
    </div>
  );
});

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  },
  chatSection: {
    flex: 1, // Takes up the remaining space
    backgroundColor: "#f9f9f9",
    padding: "10px",
    overflowY: "auto",
  },
};
