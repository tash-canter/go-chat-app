import React, { createContext } from "react";
import "./App.css";
import { Header } from "./components/";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { Route, Routes } from "react-router-dom";
import { LoginPage, ChatPage, RegisterPage } from "./components";
import { StoreContext } from "./stores/StoreContext";
import chatStore from "./stores/ChatStore";

const App = () => {
  return (
    <StoreContext.Provider value={chatStore}>
      {/* <div>HELLO</div> */}
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </StoreContext.Provider>
  );
};

export default App;
