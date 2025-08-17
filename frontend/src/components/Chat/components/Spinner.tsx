import React from "react";
import { Box, CircularProgress } from "@mui/material";

export const Spinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" p={2}>
    <CircularProgress />
  </Box>
);
