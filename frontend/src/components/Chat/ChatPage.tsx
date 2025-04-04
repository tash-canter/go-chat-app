import React, { useContext, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../stores/ChatStore";
import { ChatHistory, ChatInput, SearchSidebar } from "./components";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import {
  addConversation,
  Conversation,
  fetchUsers,
  hydrateConversations,
  User,
} from "../../api/chatApi";

export const ChatPage = observer(() => {
  const chatStore = useContext(StoreContext);
  if (!chatStore) {
    throw new Error("StoreContext must be used within a StoreContext.Provider");
  }
  const {
    username,
    jwt,
    addPrivateMessage,
    messages,
    initializeSocket,
    hydratePrivateMessages,
    subscribeToConversation,
    isLoggedIn,
  } = chatStore;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [conversationId, setConversationId] = useState<number>();
  const [recipientDetails, setRecipientDetails] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      hydrateConversations(jwt, setConversations);
      initializeSocket();
    } else {
      navigate("/");
    }
  }, [isLoggedIn]);

  const sendMessage = (event: any) => {
    if (event.keyCode === 13 && conversationId && recipientDetails) {
      addPrivateMessage(event.target.value, conversationId, recipientDetails);
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

  const { data: users, isLoading } = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: async () => await fetchUsers(query, jwt),
    enabled: !!query, // Only execute when query has a value
  });

  const handleSearch = (queryString: string) => {
    debouncedSetQuery(queryString);
  };

  const handleSelectUser = (id: number, username: string) => {
    addConversation(jwt, id, setConversationId);
    // setConversationId(conversationId);
    setRecipientDetails({
      userId: id,
      username,
    });
    if (conversationId) {
      subscribeToConversation(conversationId);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setConversationId(conversation.conversationId);
    setRecipientDetails({
      username: conversation.displayName,
      userId: 0,
    });
    console.log(conversation);
    hydratePrivateMessages(conversation.conversationId);
    subscribeToConversation(conversation.conversationId);
  };

  return (
    <div style={styles.container}>
      <SearchSidebar
        onSearch={handleSearch}
        searchResults={users}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        onSelectUser={handleSelectUser}
        isLoading={isLoading}
        selectedUserId={recipientDetails ? recipientDetails.userId : 0}
      />
      <div style={styles.chatSection}>
        <ChatHistory
          chatHistory={messages}
          username={username}
          recipientUsername={recipientDetails?.username}
        />
        {recipientDetails?.username && <ChatInput send={sendMessage} />}
      </div>
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
