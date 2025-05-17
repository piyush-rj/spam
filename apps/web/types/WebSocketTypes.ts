export enum WebSocketType {
  chat = "chat",
  subscribe = "subscribe",
  unsubscribe = "unsubscribe",
  userUpdate = "user-update",
  userList = "user-list"
}

export interface ChatPayload {
  message: string;
  timeStamp: string;
  senderId: string;
}

export interface User {
  userId: string;
  userName: string;
  joinedAt?: string;
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
    payload?: {
      userId?: string;
      userName?: string;
    };
  }
  | {
    type: WebSocketType.userUpdate;
    roomId: string;
    payload: {
      userCount: number;
      users?: User[];
      currentUser?: User;
    };
  }
  | {
    type: WebSocketType.userList;
    roomId: string;
    payload: {
      users: User[];
    };
  };    