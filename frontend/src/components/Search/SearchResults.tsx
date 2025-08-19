import React from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
} from "@mui/material";

interface User {
  userID: string;
  username: string;
}

interface SearchResultsProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

export const SearchResults = ({ users, onUserSelect }: SearchResultsProps) => {
  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "80%", md: "700px" },
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid key={user.userID}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
                border: "1px solid",
                borderColor: "divider",
              }}
              onClick={() => onUserSelect(user)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 48,
                      height: 48,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {getInitials(user.username)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 500,
                        color: "text.primary",
                        mb: 0.5,
                      }}
                    >
                      {user.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      Click to start chatting
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
