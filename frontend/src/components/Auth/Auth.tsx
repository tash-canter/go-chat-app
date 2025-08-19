import React, { useState } from "react";
import { useAuth } from "../../api/queries";
import { AuthCard } from ".";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { mutate: authenticate, error } = useAuth(isLogin);

  const handleSubmit = (username: string, password: string) => {
    authenticate({ username, password });
  };

  const toggleAuthMode = () => {
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
