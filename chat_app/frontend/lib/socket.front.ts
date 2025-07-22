import { ChatMessage, IncomingMessageType, SocketMessage, SubscribeMessage, UnsubscribeMessage } from "@/types/socketTypes";

export class WebSocketClient {
    private ws: WebSocket | null = null;
    private url: string;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private messageHandlers = new Map<string, Set<(message: any) => void>>();
    private connectionHandlers = new Set<(connected: boolean) => void>();

    constructor(url: string) {
        this.url = url;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);

                this.ws.onopen = () => {
                    this.reconnectAttempts = 0;
                    this.notifyConnectionHandlers(true);
                    resolve();
                };

                this.ws.onclose = () => {
                    this.notifyConnectionHandlers(false);
                    this.handleReconnect();
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    reject(error);
                };

                this.ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        this.handleIncomingMessage(message);
                    } catch (error) {
                        console.error('Failed to parse message:', error);
                    }
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        }
    }

    private handleIncomingMessage(message: any) {
        const { type, roomId } = message;

        if (roomId) {
            const roomHandlers = this.messageHandlers.get(roomId);
            if (roomHandlers) {
                roomHandlers.forEach(handler => handler(message));
            }
        }

        const globalHandlers = this.messageHandlers.get('*');
        if (globalHandlers) {
            globalHandlers.forEach(handler => handler(message));
        }
    }

    private notifyConnectionHandlers(connected: boolean) {
        this.connectionHandlers.forEach(handler => handler(connected));
    }

    subscribe(roomId: string, userId: string): void {
        const message: SubscribeMessage = {
            type: IncomingMessageType.SUBSCRIBE,
            roomId,
            payload: { userId }
        };
        this.sendMessage(message);
    }

    unsubscribe(roomId: string): void {
        const message: UnsubscribeMessage = {
            type: IncomingMessageType.UNSUBSCRIBE,
            roomId
        };
        this.sendMessage(message);
    }

    sendChat(roomId: string, senderId: string, message: string): void {
        const chatMessage: ChatMessage = {
            type: IncomingMessageType.CHAT,
            roomId,
            payload: {
                senderId,
                message
            }
        };
        this.sendMessage(chatMessage);
    }

    private sendMessage(message: SocketMessage): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not connected');
        }
    }

    onMessage(roomId: string, handler: (message: any) => void): () => void {
        if (!this.messageHandlers.has(roomId)) {
            this.messageHandlers.set(roomId, new Set());
        }
        this.messageHandlers.get(roomId)!.add(handler);

        return () => {
            const handlers = this.messageHandlers.get(roomId);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    this.messageHandlers.delete(roomId);
                }
            }
        };
    }

    onConnection(handler: (connected: boolean) => void): () => void {
        this.connectionHandlers.add(handler);
        return () => this.connectionHandlers.delete(handler);
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}