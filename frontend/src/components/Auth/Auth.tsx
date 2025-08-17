import React from "react";
import { useAuth } from "../../api/queries";
import { AuthCard } from ".";

export const Auth = ({ isLogin }: { isLogin: boolean }) => {
  const { mutate: authenticate, error } = useAuth(isLogin ? true : false);
  const handleSubmit = (username: string, password: string) => {
    authenticate({ username, password });
  };

  return <AuthCard onSubmit={handleSubmit} isLogin={isLogin} error={error} />;
};
