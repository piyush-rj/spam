import { useState, useEffect, useCallback } from 'react';
import { WebSocketMessage, WebSocketType } from "../types/WebSocketTypes";

type UseWebSocketProps = {
  url: string;
  roomId?: string;
  autoConnect?: boolean;
  autoSubscribe?: boolean;
  onMessage?: (message: WebSocketMessage) => void;
};

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export const useWebSocket = ({
  url,
  roomId,
  autoConnect = true,
  autoSubscribe = false,
  onMessage
}: UseWebSocketProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [subscribedRooms, setSubscribedRooms] = useState<string[]>([]);

  // connect to ws
  const connect = useCallback(() => {
    if (socket) return;

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        setSocket(ws);
        setStatus('connected');
        setError(null);
        
        if (autoSubscribe && roomId) {
          subscribe(roomId);
        }
      };
      
      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          setMessages(prev => [...prev, data]);
          if (onMessage) onMessage(data);
        } catch (err) {
          console.error('Failed to parse message:', err);
        }
      };
      
      ws.onerror = () => {
        setStatus('error');
        setError(new Error('WebSocket connection error'));
      };
      
      ws.onclose = () => {
        setStatus('disconnected');
        setSocket(null);
      };
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err : new Error('Unknown WebSocket error'));
    }
  }, [url, socket, autoSubscribe, roomId, onMessage]);

  // disconnect from ws
  const disconnect = useCallback(() => {
    if (!socket) return;
    
    socket.close();
    setSocket(null);
    setStatus('disconnected');
    setSubscribedRooms([]);
  }, [socket]);

  // sub to a room
  const subscribe = useCallback((roomId: string) => {
    if (!socket || status !== 'connected') return;
    
    const message: WebSocketMessage = {
      type: WebSocketType.subscribe,
      roomId
    };
    
    socket.send(JSON.stringify(message));
    setSubscribedRooms(prev => [...prev.filter(id => id !== roomId), roomId]);
  }, [socket, status]);

  // unsub from a room
  const unsubscribe = useCallback((roomId: string) => {
    if (!socket || status !== 'connected') return;
    
    const message: WebSocketMessage = {
      type: WebSocketType.unsubscribe,
      roomId
    };
    
    socket.send(JSON.stringify(message));
    setSubscribedRooms(prev => prev.filter(id => id !== roomId));
  }, [socket, status]);

  // send msg
  const sendMessage = useCallback((roomId: string, message: string, senderId: string) => {
    if (!socket || status !== 'connected') return false;
    
    const chatMessage: WebSocketMessage = {
      type: WebSocketType.chat,
      roomId,
      payload: {
        message,
        timeStamp: new Date(),
        senderId
      }
    };
    
    socket.send(JSON.stringify(chatMessage));
    return true;
  }, [socket, status]);

  // auto-connect
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [autoConnect, connect, socket]);

  return {
    status,
    error,
    messages,
    subscribedRooms,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage,
    isConnected: status === 'connected'
  };
};