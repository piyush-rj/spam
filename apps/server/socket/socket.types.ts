export enum IncomingMessageType {
    CHAT = "CHAT",
    SUBSCRIBE = "SUBSCRIBE",
    UNSUBSCRIBE = "UNSUBSCRIBE",
    ROOM_CREATED = "ROOM_CREATED",
    ROOM_DELETED = "ROOM_DELETED",
    ROOM_JOINED = "ROOM_JOINED",
    ROOM_LEFT = "ROOM_LEFT"
}

export interface ChatPayload {
    message: string;
    timestamp: Date;
    senderId: string;
}


export interface SubscribePayload {
    userId: string;
}

export interface RoomCreatedPayload {
    id: string;
    name: string;
    createdBy: string;
}


export interface RoomDeletedPayload {
    id: string;
}


export interface RoomJoinedPayload {
    roomId: string;
    userId: string;
}


export interface RoomLeftPayload {
    roomId: string;
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
    }
    | {
        type: IncomingMessageType.ROOM_CREATED;
        payload: RoomCreatedPayload;
    }
    | {
        type: IncomingMessageType.ROOM_DELETED;
        payload: RoomDeletedPayload;
    }
    | {
        type: IncomingMessageType.ROOM_JOINED;
        payload: RoomJoinedPayload;
    }
    | {
        type: IncomingMessageType.ROOM_LEFT;
        payload: RoomLeftPayload;
    };
