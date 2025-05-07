import WebSocket, { WebSocketServer } from "ws";
import { WebSocketMessage, WebSocketType, User } from "./types/SocketTypes";
import { Server } from "http";

export class WebSocketClass {
    private wss: WebSocketServer;
    private wsSubscription: Map<string, Set<WebSocket>>;
    private wsUserMap: Map<WebSocket, User>;

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.wsSubscription = new Map<string, Set<WebSocket>>();
        this.wsUserMap = new Map<WebSocket, User>();
        this.init();
    }

    private init() {
        this.wss.on("connection", (socket) => {
            socket.on("message", (message: string) => {
                this.handleMessage(message, socket);
            });

            socket.on("close", () => {
                this.cleanupSocket(socket);
            });
        });
    }

    private cleanupSocket(socket: WebSocket) {
        for (const [roomId, sockets] of this.wsSubscription.entries()) {
            if (sockets.has(socket)) {
                sockets.delete(socket);
                this.wsUserMap.delete(socket);
                console.log(`Socket disconnected from room ${roomId}`);

                if (sockets.size === 0) {
                    this.wsSubscription.delete(roomId);
                } else {
                    this.broadcastUserCount(roomId);
                }
            }
        }
    }

    private handleMessage(message: string, socket: WebSocket) {
        const socketMessage: WebSocketMessage = JSON.parse(message);

        switch (socketMessage.type) {
            case WebSocketType.subscribe:
                return this.handleJoin(socketMessage, socket);
            case WebSocketType.unsubscribe:
                return this.handleLeave(socketMessage, socket);
            case WebSocketType.chat:
                return this.handleChat(socketMessage, socket);
            default:
                return;
        }
    }

    private handleJoin(subscribeMessage: WebSocketMessage, socket: WebSocket) {
        try {
            const roomId = subscribeMessage.roomId;
            if (!roomId) throw new Error("Missing roomId");

            if (!this.wsSubscription.has(roomId)) {
                this.wsSubscription.set(roomId, new Set<WebSocket>());
            }

            this.wsSubscription.get(roomId)?.add(socket);

            // Mock user — ideally you should receive this from client payload or use token-based auth
            const user: User = {
                userId: Math.random().toString(36).substring(2, 10),
                userName: `User-${Math.floor(Math.random() * 1000)}`,
                joinedAt: new Date(),
            };
            this.wsUserMap.set(socket, user);

            console.log(`User subscribed to room ${roomId}`);
            this.broadcastUserCount(roomId);
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleChat(chatMessage: WebSocketMessage, socket: WebSocket) {
        try {
            if (chatMessage.type !== WebSocketType.chat) return;

            const message = JSON.stringify(chatMessage);
            if (!message) return;

            const roomId = chatMessage.roomId;
            const sockets = this.wsSubscription.get(roomId);

            console.log("received message: ", message);
            console.log("sending to room: ", roomId, " with sockets: ", sockets?.size);

            if (!sockets) return;

            sockets.forEach((s) => {
                s.send(message);
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleLeave(unsubscribeMessage: WebSocketMessage, socket: WebSocket) {
        try {
            const roomId = unsubscribeMessage.roomId;
            if (!roomId) return;

            this.wsSubscription.get(roomId)?.delete(socket);
            this.wsUserMap.delete(socket);

            if (this.wsSubscription.get(roomId)?.size === 0) {
                this.wsSubscription.delete(roomId);
            } else {
                this.broadcastUserCount(roomId);
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    private broadcastUserCount(roomId: string) {
        const sockets = this.wsSubscription.get(roomId);
        if (!sockets) return;

        const users: User[] = Array.from(sockets)
            .map((s) => this.wsUserMap.get(s))
            .filter(Boolean) as User[];

        const userCountMessage: WebSocketMessage = {
            type: WebSocketType.userUpdate,
            roomId,
            payload: {
                userCount: users.length,
                users,
            },
        };

        const messageStr = JSON.stringify(userCountMessage);
        console.log("Users online:", users.length);

        sockets.forEach((s) => {
            s.send(messageStr);
        });
    }

    private handleError(error: unknown) {
        console.error(error);
        return error;
    }
}
