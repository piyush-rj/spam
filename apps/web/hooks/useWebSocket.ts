import { useCallback, useEffect, useRef, useState } from "react";
import { User, WebSocketMessage, WebSocketType } from "../types/WebSocketTypes";

export function useWebSocket(userId: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(0); 
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);

      switch (message.type) {
        case WebSocketType.chat:
          setMessages((prev) => [...prev, message]);
          break;

        case WebSocketType.userUpdate:
          setUserCount(message.payload.userCount);
          break;

        case WebSocketType.userList:
          setUsers(message.payload.users)
          break;

        default:
          console.warn("Unknown message type:", message.type);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    if (socketRef.current && connected) {
      const payload = { type: "subscribe", roomId };
      socketRef.current.send(JSON.stringify(payload));
      setCurrentRoomId(roomId);
    }
  }, [connected]);

  const leaveRoom = useCallback(() => {
    if (socketRef.current && connected && currentRoomId) {
      const payload = { type: "unsubscribe", roomId: currentRoomId };
      socketRef.current.send(JSON.stringify(payload));
      setCurrentRoomId(null);
    }
  }, [connected, currentRoomId]);

  const sendMessage = useCallback((text: string) => {
    if (socketRef.current && connected && currentRoomId) {
      const payload: WebSocketMessage = {
        type: WebSocketType.chat,
        roomId: currentRoomId,
        payload: {
          message: text,
          timeStamp: new Date(),
          senderId: userId,
        },
      };
      socketRef.current.send(JSON.stringify(payload));
    }
  }, [connected, currentRoomId, userId]);

  return {
    connected,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    currentRoomId,
    userCount,
    users
  };
}
