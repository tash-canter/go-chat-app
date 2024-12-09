import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../stores/ChatStore";
import { Link, useNavigate } from "react-router-dom";
import { LoginRegisterCard } from ".";

export const LoginPage = observer(() => {
  const [error, setError] = useState(null);
  const chatStore = useContext(StoreContext);
  const navigate = useNavigate();
  if (!chatStore) {
    throw new Error("StoreContext must be used within a StoreContext.Provider");
  }
  const {
    username,
    password,
    isLoggedIn,
    setPassword,
    setUsername,
    setToken,
    hydrateMessages,
    setIsLoggedIn,
    setUserId,
  } = chatStore;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chat");
    }
  }, []);
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed! Please check your credentials.");
      }

      const data = await response.json();

      setToken(data.jwt);
      setUserId(data.userId);

      setIsLoggedIn(true);
      // hydrateMessages();
      navigate("/chat");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <LoginRegisterCard
      onSubmit={handleSubmit}
      isLogin
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
    />
  );
});
