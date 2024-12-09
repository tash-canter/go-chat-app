import { useQuery } from "@tanstack/react-query";
import React, { useState, ChangeEvent, useMemo } from "react";
import { Spinner } from ".";

interface SearchResult {
  userId: string;
  username: string;
}
interface SearchSidebarProps {
  onSearch: (query: string) => void;
  searchResults: Array<SearchResult>;
  onSelectUser: (userId: Number, username: string) => void;
  isLoading: boolean;
  selectedUserId: Number;
}

export const SearchSidebar = ({
  onSearch,
  searchResults,
  onSelectUser,
  isLoading,
  selectedUserId,
}: SearchSidebarProps) => {
  const [localQuery, setLocalQuery] = useState("");
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
        <ul style={styles.resultList}>
          {searchResults.map((result) => (
            <li
              key={result.userId}
              style={{
                ...styles.resultItem,
                ...(selectedUserId === Number(result.userId) &&
                  styles.selectedItem),
              }}
              onClick={() =>
                onSelectUser(Number(result.userId), result.username)
              }
            >
              {result.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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
  sidebar: {
    width: "300px", // Fixed width for the sidebar
    backgroundColor: "#ffffff",
    borderLeft: "1px solid #ddd",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    padding: "10px",
  },
  input: {
    width: "100%",
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
