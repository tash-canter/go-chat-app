import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchUsers,
  loginUser,
  registerUser,
  validateCookie,
  logoutUser,
} from "./api";
import { useChatStore } from "../stores/state";

export const QUERY_KEYS = {
  messages: (recipientID: number | null) => ["messages", recipientID],
  validateCookie: () => ["validateCookie"],
};

export const useAuth = (isLogin: boolean) => {
  const { setAuth } = useChatStore();

  return useMutation({
    mutationFn: isLogin ? loginUser : registerUser,
    onSuccess: (data) => {
      setAuth(data.username, data.userID);
    },
  });
};

export const useValidateCookie = () => {
  const { setAuth, setLoading } = useChatStore();

  return useMutation({
    mutationFn: validateCookie,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      setAuth(data.username, data.userID);
    },
    onError: () => {
      setLoading(false);
    },
  });
};

export const useLogout = () => {
  const { logout } = useChatStore();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
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
