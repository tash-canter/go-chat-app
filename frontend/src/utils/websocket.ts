let socket: WebSocket | null = null;
let messageHandler: ((message: any) => void) | null = null;

export const connectWebSocket = () => {
  if (socket?.readyState === WebSocket.OPEN) {
    console.log("WebSocket already connected");
    return;
  }

  console.log("Connecting WebSocket...");
  socket = new WebSocket("ws://localhost:5173/ws");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const receivedMessage = JSON.parse(event.data);
      if (messageHandler) {
        messageHandler(receivedMessage);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  socket.onclose = (event) => {
    console.log("WebSocket closed:", event);
    socket = null;
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    socket = null;
  };

  return socket;
};

export const setMessageHandler = (handler: ((message: any) => void) | null) => {
  messageHandler = handler;
};

export const getWebSocket = () => socket;
export const isWebSocketConnected = () => socket?.readyState === WebSocket.OPEN;
