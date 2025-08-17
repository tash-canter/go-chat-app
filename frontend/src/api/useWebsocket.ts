// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { fetchMessages } from "./api";
import { useChatStore } from "../stores/state";
import { QUERY_KEYS } from "./queries";
import { Message } from "../types";

export const useWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  const { userID, username, recipientID, recipientUsername } = useChatStore();
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
      console.log("HERE");
      if (
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        console.log("not connected");
        throw new Error("WebSocket not connected");
      }

      if (!userID || !username || !recipientUsername || !recipientID) {
        console.log(
          "not available",
          userID,
          username,
          recipientUsername,
          recipientID
        );
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

      console.log("sending", msgObj);
      socketRef.current.send(JSON.stringify(msgObj));
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
    const connectWebSocket = () => {
      const socket = new WebSocket("ws://localhost:5173/ws");

      socket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      socket.onmessage = (event: MessageEvent) => {
        try {
          const receivedMessage = JSON.parse(event.data) as Message;

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
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      socket.onclose = (event) => {
        console.log("WebSocket closed:", event);
        setIsConnected(false);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      socketRef.current = socket;
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [queryClient]);

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
