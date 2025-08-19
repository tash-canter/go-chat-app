import { useEffect, useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { fetchMessages } from "./api";
import { useChatStore } from "../stores/state";
import { QUERY_KEYS } from "./queries";
import { Message } from "../types";
import {
  getWebSocket,
  isWebSocketConnected,
  setMessageHandler,
} from "../utils/websocket";

export const useWebSocket = () => {
  const queryClient = useQueryClient();
  const { userID, username, recipientID, recipientUsername } = useChatStore();
  const [isConnected, setIsConnected] = useState(false);

  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.messages(recipientID),
    queryFn: () => fetchMessages(recipientID),
    enabled: !!recipientID,
    staleTime: 0,
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (messageText: string) => {
      const socket = getWebSocket();
      if (!socket || !isWebSocketConnected()) {
        throw new Error("WebSocket not connected");
      }

      if (!userID || !username || !recipientUsername || !recipientID) {
        throw new Error("Send message not available");
      }

      const msgObj: Message = {
        body: messageText,
        username,
        timestamp: new Date().toISOString(),
        userID,
        recipientID,
        recipientUsername,
      };

      socket.send(JSON.stringify(msgObj));
      return msgObj;
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        QUERY_KEYS.messages(recipientID),
        (oldMessages: Message[] = []) => {
          return [...oldMessages, newMessage];
        }
      );
    },
  });

  useEffect(() => {
    const handleMessage = (receivedMessage: Message) => {
      queryClient.setQueryData(
        QUERY_KEYS.messages(receivedMessage.recipientID),
        (oldMessages: Message[] = []) => {
          const messageExists = oldMessages.some(
            (msg) =>
              msg.timestamp === receivedMessage.timestamp &&
              msg.userID === receivedMessage.userID &&
              msg.body === receivedMessage.body
          );

          if (messageExists) return oldMessages;
          return [...oldMessages, receivedMessage];
        }
      );
    };

    setMessageHandler(handleMessage);

    return () => {
      setMessageHandler(null);
    };
  }, [queryClient]);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(isWebSocketConnected());
    };

    checkConnection();

    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (recipientID) {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(recipientID),
      });
    }
  }, [recipientID, queryClient]);

  return {
    messages,
    isLoading,
    error,
    isConnected,
    sendMessage,
  };
};
