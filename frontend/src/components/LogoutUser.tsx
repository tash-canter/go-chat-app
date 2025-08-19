import React from "react";
import { Button } from "@mui/material";
import { useChatStore } from "../stores/state";
import { useLogout } from "../api/queries";

interface LogoutUserProps {
  size?: "small" | "medium" | "large";
}

export const LogoutUser = ({ size = "medium" }: LogoutUserProps) => {
  const { mutate: logoutUser } = useLogout();

  return (
    <Button color="inherit" onClick={logoutUser}>
      Logout
    </Button>
  );
};
