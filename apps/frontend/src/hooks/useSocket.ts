// hooks/useSocket.ts
import { useEffect } from "react";
import { useSocketStore } from "@/app/zustand/atoms/zustand"; 

export const useSocket = () => {
  const initializeSocketClient = useSocketStore((state) => state.initializeSocketClient);
  const socketClient = useSocketStore((state) => state.socketClient);
  const connectionState = useSocketStore((state) => state.connectionState);
  const isReady = useSocketStore((state) => state.isReady);

  useEffect(() => {
    initializeSocketClient();
  }, [initializeSocketClient]);

  const sendMessage = (type: string, payload: any) => {
    if(!socketClient) {
      console.log("socket client not initialized");
      return;
    }
    socketClient?.send(type, payload);
  };

  const useSubscribe = (type: string, handler: (payload: any) => void) => {
    useEffect(() => {
      if (!socketClient) return;

      const unsubscribe = socketClient.subscribe(type, handler);
      return () => unsubscribe?.();
    }, [socketClient, type, handler]);
  };

  const subscribeToRoom = (roomId: string) => {
    if(!socketClient?.subscribeToRoom) {
      console.log("subscribe not workign");
      return;
    }
    socketClient?.subscribeToRoom(roomId);
  };

  const unsubscribeFromRoom = (roomId: string) => {
    if(!socketClient?.unsubscribeFromRoom) {
      console.log("unsubscribe not working");
      return;
    }
    socketClient?.unsubscribeFromRoom(roomId);
  };

  return {
    sendMessage,
    useSubscribe,
    subscribeToRoom,
    unsubscribeFromRoom,
    isReady,
    connectionState,
  };
};
