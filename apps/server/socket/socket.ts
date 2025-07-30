import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { IncomingMessageType, type SocketType } from "./socket.types";
import type { Server as HTTPServer } from "http";


class WebSocketClass {
    private wss: WebSocketServer;
    private wsSubscription: Map<string, Set<WebSocket>>;

    constructor(server: HTTPServer) {
        this.wss = new WebSocketServer({ server });
        this.wsSubscription = new Map();
        this.init();
    }

    private init() {
        this.wss.on("connection", (socket) => {
            socket.on("message", (message: Buffer) => {
                this.handleMessage(message.toString(), socket);
            });

            socket.on("close", () => {
                this.cleanupSocket(socket);
            });
        });
    }


    private handleMessage(message: string, socket: WebSocket) {
        try {
            const socketMessage: SocketType = JSON.parse(message);

            switch (socketMessage.type) {
                case IncomingMessageType.SUBSCRIBE:
                    return this.handleSubscription(socketMessage, socket);

                case IncomingMessageType.UNSUBSCRIBE:
                    return this.handleUnsubscription(socketMessage, socket);

                case IncomingMessageType.CHAT:
                    return this.handleChat(socketMessage, socket);

                case IncomingMessageType.ROOM_CREATED:
                    return this.broadcastGlobal(socketMessage);

                case IncomingMessageType.ROOM_DELETED:
                    return this.broadcastGlobal(socketMessage);

                case IncomingMessageType.ROOM_JOINED:
                    return this.broadcastGlobal(socketMessage);

                case IncomingMessageType.ROOM_LEFT:
                    return this.broadcastGlobal(socketMessage);

                default:
                    return;
            }
        } catch (error) {
            console.log("Failed to parse message:", error);
        }
    }

    private handleSubscription(
        subscribeMessage: Extract<SocketType, { type: IncomingMessageType.SUBSCRIBE }>,
        socket: WebSocket
    ) {
        try {
            const { roomId, payload } = subscribeMessage;
            if (!roomId) {
                console.log("room-id not found");
                return;
            }

            if (!this.wsSubscription.has(roomId)) {
                this.wsSubscription.set(roomId, new Set<WebSocket>());
            }
            this.wsSubscription.get(roomId)?.add(socket);

            console.log(`User ${payload.userId} subscribed to room ${roomId}`);
        } catch (error) {
            console.log("room-join error: ", error);
        }
    }

    private handleUnsubscription(
        unsubscribeMessage: Extract<SocketType, { type: IncomingMessageType.UNSUBSCRIBE }>,
        socket: WebSocket
    ) {
        try {
            const { roomId } = unsubscribeMessage;
            if (!roomId) {
                console.log("room-id not found");
                return;
            }

            const room = this.wsSubscription.get(roomId);
            if (!room || !room.has(socket)) {
                console.log("You are not in the room");
                return;
            }

            room.delete(socket);
            if (room.size === 0) {
                this.wsSubscription.delete(roomId);
            }

            console.log(`User unsubscribed from room ${roomId}`);
        } catch (error) {
            console.log("room unsubscription failed: ", error);
        }
    }

    private handleChat(
        chatMessage: Extract<SocketType, { type: IncomingMessageType.CHAT }>,
        socket: WebSocket
    ) {
        try {
            const { roomId, payload } = chatMessage;

            if (!roomId) {
                console.log("roomId is required for chat messages");
                return;
            }

            const sockets = this.wsSubscription.get(roomId);
            if (!sockets) {
                console.log(`No subscribers found for room ${roomId}`);
                return;
            }

            const messageToSend = JSON.stringify({
                type: IncomingMessageType.CHAT,
                roomId,
                payload: {
                    ...payload,
                    timestamp: new Date()
                }
            });

            sockets.forEach((s) => {
                if (s.readyState === WebSocket.OPEN) {
                    s.send(messageToSend);
                }
            });

            console.log(`Message sent to room ${roomId} by ${payload.senderId}`);
        } catch (error) {
            console.log("chat message error: ", error);
        }
    }

    private cleanupSocket(socket: WebSocket) {
        this.wsSubscription.forEach((sockets, roomId) => {
            if (sockets.has(socket)) {
                sockets.delete(socket);
                if (sockets.size === 0) {
                    this.wsSubscription.delete(roomId);
                }
            }
        });
    }

    public getRoomStats() {
        const stats = new Map<string, number>();
        this.wsSubscription.forEach((sockets, roomId) => {
            stats.set(roomId, sockets.size);
        });
        return stats;
    }


    private broadcastGlobal(message: SocketType) {
        const payload = JSON.stringify(message);

        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload)
            }
        })
    }
}

export default WebSocketClass;