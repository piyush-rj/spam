export enum IncomingMessageType {
    SUBSCRIBE = "SUBSCRIBE",
    UNSUBSCRIBE = "UNSUBSCRIBE",
    CHAT = "CHAT"
}

export interface SubscribeMessage {
    type: IncomingMessageType.SUBSCRIBE;
    roomId: string;
    payload: {
        userId: string;
    };
}

export interface UnsubscribeMessage {
    type: IncomingMessageType.UNSUBSCRIBE;
    roomId: string;
}

export interface ChatMessage {
    type: IncomingMessageType.CHAT;
    roomId: string;
    payload: {
        senderId: string;
        message: string;
        timestamp?: Date;
    };
}

export type SocketMessage = SubscribeMessage | UnsubscribeMessage | ChatMessage;
