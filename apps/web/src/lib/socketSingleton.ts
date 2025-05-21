import { WebSocketClient } from "./socket.front";

const WS_URL = 'wss:/localhost:8080'; 

let socket: WebSocketClient | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = new WebSocketClient(WS_URL);
  }
  return socket;
};
