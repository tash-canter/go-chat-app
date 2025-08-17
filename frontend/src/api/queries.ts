import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUsers, loginUser, registerUser } from "./api";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../stores/state";

export const QUERY_KEYS = {
  messages: (recipientID: number | null) => ["messages", recipientID],
};

export const useAuth = (isLogin: boolean) => {
  const navigate = useNavigate();
  const { setAuth } = useChatStore();

  return useMutation({
    mutationFn: isLogin ? loginUser : registerUser,
    onSuccess: (data) => {
      setAuth(data.username, data.userID);
      navigate("/chat");
    },
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: [query],
    queryFn: async () => await fetchUsers(query),
    enabled: !!query,
  });
};
