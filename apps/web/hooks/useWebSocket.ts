import { useCallback, useEffect, useRef, useState } from "react";
import { WebSocketMessage, WebSocketType } from "../types/WebSocketTypes";


export function useWebSocket(userId: string){
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null)


  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true)
      console.log("Websocket connected")
    }

    socket.onmessage = (event) => {
      const messages: WebSocketMessage = JSON.parse(event.data);
      if ( messages.type == "chat" ) {
        setMessages((prev) => [...prev, messages])
      }
    }

    socket.onclose = () => {
      setConnected(false)
      console.log("websocket disconnected")
    }

    return () => {
      socket.close()
    }
  }, [])


  const joinRoom = useCallback((roomId: string) => {
    if (socketRef.current && connected) {
      const payload = { type: "subscribe", roomId}
      socketRef.current?.send(JSON.stringify(payload))
      setCurrentRoomId(roomId)
    }
  }, [connected])

  
  const leaveRoom = useCallback(() => {
    if (socketRef.current && connected && currentRoomId) {
      const payload = { type: "unsubscribe", roomId: currentRoomId }
      socketRef.current.send(JSON.stringify(payload))
      setCurrentRoomId(null)
    }
  }, [connected, currentRoomId])
  
  
  const sendMessage = useCallback((text: string) => {
    if (socketRef.current && connected && currentRoomId) {
      const payload: WebSocketMessage = {
        type: WebSocketType.chat,
        roomId: currentRoomId,
        payload: {
          message: text,
          timeStamp: new Date(),
          senderId: userId
        }
      };
      
    }
  }, [connected, currentRoomId, userId])

  return {
    connected,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    currentRoomId
  }

}



