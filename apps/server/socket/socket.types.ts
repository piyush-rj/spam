export enum IncomingMessageType {
    CHAT = "CHAT",
    SUBSCRIBE = "SUBSCRIBE",
    UNSUBSCRIBE = "UNSUBSCRIBE"
}

export interface ChatPayload {
    message: string;
    timestamp: Date;
    senderId: string;
}

export interface SubscribePayload {
    userId: string;
}

export type SocketType =
    | {
        type: IncomingMessageType.CHAT;
        roomId: string;
        payload: ChatPayload;
    }
    | {
        type: IncomingMessageType.SUBSCRIBE;
        roomId: string;
        payload: SubscribePayload;
    }
    | {
        type: IncomingMessageType.UNSUBSCRIBE;
        roomId: string;
    };