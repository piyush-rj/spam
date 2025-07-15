export enum WebSocketType {
    CHAT = "CHAT",
    SUBSCRIBE = "SUBSCRIBE",
    UNSUBSCRIBE = "UNSUBSCRIBE"
}

export interface payload {
    message: String,
    timestamp: Date,
    senderId: String
}

export type SocketType = {
    type: WebSocketType.CHAT,
    roomId: String,
    payload: payload
} | {
    type: WebSocketType.SUBSCRIBE | WebSocketType.UNSUBSCRIBE,
    roomId: String
}
