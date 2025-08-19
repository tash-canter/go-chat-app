import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useChatStore } from "./stores/state";
import { useAppInitialization } from "./hooks/useAppInitialization";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Auth } from "./components/Auth/Auth";
import { SearchView } from "./components/Search";
import { ChatPage } from "./components";
import { theme } from "./theme";

const AppContent = () => {
  const { currentView, isLoading } = useChatStore();
  const { isInitialized } = useAppInitialization();

  if (!isInitialized || isLoading) {
    return <LoadingSpinner />;
  }

  switch (currentView) {
    case "auth":
      return <Auth />;
    case "search":
      return <SearchView />;
    case "chat":
      return <ChatPage />;
    default:
      return <Auth />;
  }
};

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
