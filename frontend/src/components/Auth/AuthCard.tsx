import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
} from "@mui/material";

interface AuthCardProps {
  onSubmit: (username: string, password: string) => void;
  isLogin: boolean;
  error: Error | null;
  onToggleMode: () => void;
}

export const AuthCard = ({
  onSubmit,
  isLogin,
  error,
  onToggleMode,
}: AuthCardProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {isLogin ? "Welcome Back" : "Register"}
        </Typography>

        <Box
          component="form"
          onSubmit={(e: Event) => {
            e.preventDefault();
            onSubmit(username, password);
          }}
          noValidate
          sx={{ width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.message}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <MuiLink
              component="button"
              variant="body2"
              onClick={(e: Event) => {
                e.preventDefault();
                onToggleMode();
              }}
              sx={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
