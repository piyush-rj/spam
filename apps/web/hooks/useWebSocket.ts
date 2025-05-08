import { useCallback, useEffect, useRef, useState } from "react";
import { User, WebSocketMessage, WebSocketType } from "../types/WebSocketTypes";

interface UseWebSocketOptions {
  userId: string;
  userName?: string;
  serverUrl?: string;
}

export function useWebSocket({ 
  userId, 
  userName = `User-${Math.floor(Math.random() * 1000)}`, 
  serverUrl = "ws://localhost:8080" 
}: UseWebSocketOptions) {

  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);

  const [currentUser, setCurrentUser] = useState<User>({
    userId,
    userName,
    joinedAt: new Date().toISOString()
  });

  useEffect(() => {
    const socket = new WebSocket(serverUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      console.log("ws connected");
    };

    socket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log("received message:", message);

      switch (message.type) {
        case WebSocketType.chat:
          setMessages((prev) => [...prev, message]);
          break;

        case WebSocketType.userUpdate:
          if (message.payload.userCount !== undefined) {
            setUserCount(message.payload.userCount);
          }
          
          if (message.payload.currentUser) {
            setCurrentUser(message.payload.currentUser as User);
          }
          break;

        case WebSocketType.userList:
          if (message.payload.users) {
            setUsers(message.payload.users);
          }
          break;

        default:
          console.log("Unknown message type:", message.type);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      console.log("ws disconnected");
    };

    return () => {
      if (currentRoomId) {
        leaveRoom();
      }
      socket.close();
    };
  }, [serverUrl]);


  const joinRoom = useCallback((roomId: string) => {
    if (socketRef.current && connected) {
      const payload: WebSocketMessage = {
        type: WebSocketType.subscribe,
        roomId,
        payload: {
          userId,
          userName
        }
      };
      socketRef.current.send(JSON.stringify(payload));
      setCurrentRoomId(roomId);
      setMessages([]);
    }
  }, [connected, userId, userName]);


  const leaveRoom = useCallback(() => {
    if (socketRef.current && connected && currentRoomId) {
      const payload: WebSocketMessage = {
        type: WebSocketType.unsubscribe,
        roomId: currentRoomId
      };
      socketRef.current.send(JSON.stringify(payload));
      setCurrentRoomId(null);
      setUsers([]);
      setUserCount(0);
    }
  }, [connected, currentRoomId]);


  const sendMessage = useCallback((text: string) => {
    if (socketRef.current && connected && currentRoomId) {
      const payload: WebSocketMessage = {
        type: WebSocketType.chat,
        roomId: currentRoomId,
        payload: {
          message: text,
          timeStamp: new Date().toISOString(),
          senderId: userId,
        },
      };
      socketRef.current.send(JSON.stringify(payload));
    }
  }, [connected, currentRoomId, userId]);


  const requestUserList = useCallback(() => {
    if (socketRef.current && connected && currentRoomId) {
      const payload: WebSocketMessage = {
        type: WebSocketType.userList,
        roomId: currentRoomId,
        payload: { users: [] }
      };
      socketRef.current.send(JSON.stringify(payload));
    }
  }, [connected, currentRoomId]);
  

  return {
    connected,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    currentRoomId,
    userCount,
    users,
    currentUser,
    requestUserList
  };
}