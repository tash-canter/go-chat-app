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
  onSelectUser: (userId: number, username: string) => void;
  isLoading: boolean;
  selectedUserId: number;
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
