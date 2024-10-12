import React, { useEffect, useState } from "react";
import "./App.css";
import { connect, Message, sendMsg } from "./api";
import { Header, ChatHistory, ChatInput } from "./components/";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { EnterUsername } from "./components/EnterUsername";

const App = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>();
  useEffect(() => {
    if (username) {
      connect((msg: MessageEvent) => {
        console.log(msg);
        setChatHistory([...chatHistory, { body: msg.data, username }]);
      });
    }
  }, [chatHistory, username]);

  const send = (event: any) => {
    if (event.keyCode === 13 && username) {
      sendMsg({ body: event.target.value, username });
      event.target.value = "";
    }
  };

  const createUsername = (event: any) => {
    if (event.keyCode === 13) {
      setUsername(event.target.value);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />
        {username ? (
          <>
            <ChatHistory chatHistory={chatHistory} username={username} />
            <ChatInput send={send} />
          </>
        ) : (
          <>
            <EnterUsername send={createUsername} />
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
