import React, { useState, useMemo } from "react";
import { Box, CircularProgress } from "@mui/material";
import debounce from "lodash/debounce";
import { useSearchUsers } from "../../api/queries";
import { useChatStore } from "../../stores/state";
import { LogoutUser } from "../LogoutUser";
import { SearchInterface } from "./SearchInterface";
import { SearchResults } from "./SearchResults";
import { SearchEmpty } from "./SearchEmpty";

export const SearchView = () => {
  const [localQuery, setLocalQuery] = useState("");
  const { data, isLoading } = useSearchUsers(localQuery);
  const { setRecipient } = useChatStore();

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setLocalQuery(value), 300),
    []
  );

  const handleSearchChange = (value: string) => {
    debouncedSetQuery(value);
  };

  const handleUserSelect = (user: { userID: string; username: string }) => {
    setRecipient(user.username, Number(user.userID));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (localQuery && data?.users && data.users.length > 0) {
      return (
        <SearchResults users={data.users} onUserSelect={handleUserSelect} />
      );
    }

    if (localQuery && (!data?.users || data.users.length === 0)) {
      return <SearchEmpty />;
    }

    return null;
  };

  return (
    <Box
      sx={{
        height: "100vh",
        position: "relative",
        backgroundColor: "grey.50",
      }}
    >
      <Box sx={{ position: "absolute", top: 2, right: 2, zIndex: 1 }}>
        <LogoutUser />
      </Box>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          pt: 8,
        }}
      >
        <SearchInterface onSearchChange={handleSearchChange} />
        {renderContent()}
      </Box>
    </Box>
  );
};
