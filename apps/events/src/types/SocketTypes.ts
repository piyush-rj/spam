export enum WebSocketType {
    chat = "chat",
    subscribe = "subscribe",
    unsubscribe = "unsubscribe",
    userUpdate = "user-update" 
  }
  
  
export interface ChatPayload {
    message: string;
    timeStamp: Date;
    senderId: string;
}
  
export type WebSocketMessage =
  | {
        type: WebSocketType.chat;
        roomId: string;
        payload: ChatPayload;
    }
  | {
        type: WebSocketType.subscribe | WebSocketType.unsubscribe;
        roomId: string;
        payload?: undefined;
    }
  | {
        type: WebSocketType.userUpdate;
        roomId: string;
        payload: {
        userCount: number;
        users?: User[]; 
    };
};


  
export interface User {
    userId: string;
    userName: string;
    joinedAt?: Date;
}