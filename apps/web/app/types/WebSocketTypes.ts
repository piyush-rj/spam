export type WebSocketMessage = 
    | {
        type: WebSocketType.subscribe | WebSocketType.unsubscribe,
        roomId: String
    }
    | {
        type: WebSocketType.chat,
        roomId: String,
        payload: {
            message: String,
            timeStamp: Date,
            senderId: String
        }
    }

export enum WebSocketType {
    subscribe = "subscribe",
    unsubscribe = "unsubscribe",
    chat = "chat",
}