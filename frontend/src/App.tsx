import React, { useContext, useEffect } from "react";
import "./App.css";
import { Header } from "./components";
import { Route, Routes, useNavigate } from "react-router-dom";
import { LoginPage, ChatPage, RegisterPage } from "./components";
import { StoreContext } from "./stores/ChatStore";
import chatStore from "./stores/ChatStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <StoreContext.Provider value={chatStore}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </QueryClientProvider>
    </StoreContext.Provider>
  );
};

export default App;
