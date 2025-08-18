import React, { useState } from "react";
import { useAuth } from "../../api/queries";
import { AuthCard } from ".";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { mutate: authenticate, error } = useAuth(isLogin);

  const handleSubmit = (username: string, password: string) => {
    console.log("i am here");
    authenticate({ username, password });
  };

  const toggleAuthMode = () => {
    console.log("toggleAuthMode called");
    setIsLogin(!isLogin);
  };

  return (
    <AuthCard
      onSubmit={handleSubmit}
      isLogin={isLogin}
      error={error}
      onToggleMode={toggleAuthMode}
    />
  );
};
