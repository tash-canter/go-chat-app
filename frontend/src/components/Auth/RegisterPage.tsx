import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../stores/ChatStore";
import { LoginRegisterCard } from ".";

export const RegisterPage = observer(() => {
  const chatStore = useContext(StoreContext);
  if (!chatStore) {
    throw new Error("StoreContext must be used within a StoreContext.Provider");
  }
  const { username, password, setPassword, setUsername, setToken } = chatStore;
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Perform registration logic
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/register", {
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

      navigate("/chat");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <LoginRegisterCard
      onSubmit={handleSubmit}
      isLogin={false}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
    />
  );
});
