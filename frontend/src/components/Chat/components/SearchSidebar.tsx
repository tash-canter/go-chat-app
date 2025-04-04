import React, { useState } from "react";
import { Spinner } from ".";
import { Conversation, User } from "../../../api/chatApi";

interface SearchSidebarProps {
  onSearch: (query: string) => void;
  searchResults?: User[];
  conversations?: Conversation[];
  onSelectUser: (userId: number, username: string) => void;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading: boolean;
  selectedUserId?: number;
  selectedConversationId?: number;
}

export const SearchSidebar = ({
  onSearch,
  searchResults,
  conversations,
  onSelectUser,
  onSelectConversation,
  isLoading,
  selectedUserId,
  selectedConversationId,
}: SearchSidebarProps) => {
  const [localQuery, setLocalQuery] = useState("");

  const listToRender = () => {
    if (searchResults) {
      return searchResults.map((result) => (
        <li
          key={result.userId}
          style={{
            ...styles.resultItem,
            ...(selectedUserId === result.userId && styles.selectedItem),
          }}
          onClick={() => onSelectUser(result.userId, result.username)}
        >
          {result.username}
        </li>
      ));
    } else if (conversations) {
      return conversations.map((conversation) => (
        <li
          key={conversation.conversationId}
          style={{
            ...styles.resultItem,
            ...(selectedConversationId === conversation.conversationId &&
              styles.selectedItem),
          }}
          onClick={() => onSelectConversation(conversation)}
        >
          {conversation.displayName}
        </li>
      ));
    }
  };

  return (
    <div style={styles.sidebar}>
      <input
        type="text"
        placeholder="Search by username..."
        value={localQuery}
        onChange={(e) => {
          const newValue = e.target.value;
          setLocalQuery(newValue);
          onSearch(newValue);
        }}
        style={styles.input}
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <ul style={styles.resultList}>{listToRender()}</ul>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: "300px", // Fixed width for the sidebar
    backgroundColor: "#ffffff",
    borderRight: "1px solid #ddd",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    padding: "10px",
  },
  input: {
    width: "90%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.1)",
  },
  resultList: {
    listStyleType: "none",
    padding: 0,
    margin: "10px 0",
  },
  resultItem: {
    padding: "10px",
    margin: "5px 0",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  selectedItem: {
    backgroundColor: "#007bff",
    color: "#ffffff",
  },
  resultItemHover: {
    backgroundColor: "#e0e0e0",
  },
};
