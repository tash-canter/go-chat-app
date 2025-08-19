import React from "react";
import { Box, Typography } from "@mui/material";

export const SearchEmpty = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography color="text.secondary">No users found</Typography>
    </Box>
  );
};
