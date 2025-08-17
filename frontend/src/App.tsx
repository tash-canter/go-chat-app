import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Header } from "./components";
import { ChatPage } from "./components";
import theme from "./theme";
import { Auth } from "./components/Auth/Auth";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Routes>
          <Route path="/" element={<Auth isLogin />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/register" element={<Auth isLogin={false} />} />
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
