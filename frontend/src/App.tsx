import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Header } from "./components";
import { ChatPage } from "./components";
import theme from "./theme";
import { Auth } from "./components/Auth/Auth";
import { useChatStore } from "./stores/state";

const App = () => {
  const queryClient = new QueryClient();
  const { currentView } = useChatStore();

  const renderMainContent = () => {
    switch (currentView) {
      case "auth":
        return <Auth />;
      case "chat":
        return <ChatPage />;
      default:
        return <Auth />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        {renderMainContent()}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
