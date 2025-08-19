import React from "react";
import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchInterfaceProps {
  onSearchChange: (value: string) => void;
}

export const SearchInterface = ({ onSearchChange }: SearchInterfaceProps) => {
  return (
    <>
      <img
        src="/assets/TalkWithTash.png"
        alt="Logo"
        style={{
          height: 200,
          width: "auto",
          maxWidth: "400px",
        }}
      />

      <Box sx={{ width: { xs: "85%", sm: "75%", md: "700px" } }}>
        <TextField
          placeholder="Search users to start a conversation..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              backgroundColor: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              },
              "&.Mui-focused": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              },
            },
          }}
          variant="outlined"
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
      </Box>
    </>
  );
};
