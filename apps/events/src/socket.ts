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
        // Track which rooms this socket was in
        const affectedRooms = new Set<string>();
        
        for (const [roomId, sockets] of this.wsSubscription.entries()) {
            if (sockets.has(socket)) {
                sockets.delete(socket);
                affectedRooms.add(roomId);
                console.log(`Socket disconnected from room ${roomId}`);

                if (sockets.size === 0) {
                    this.wsSubscription.delete(roomId);
                }
            }
        }
        
        // Remove user from the user map
        this.wsUserMap.delete(socket);
        
        // Update user lists for each affected room
        affectedRooms.forEach(roomId => {
            this.broadcastUserList(roomId);
            this.broadcastUserCount(roomId);
        });
    }

    private handleMessage(message: string, socket: WebSocket) {
        try {
            const socketMessage: WebSocketMessage = JSON.parse(message);

            switch (socketMessage.type) {
                case WebSocketType.subscribe:
                    return this.handleJoin(socketMessage, socket);
                case WebSocketType.unsubscribe:
                    return this.handleLeave(socketMessage, socket);
                case WebSocketType.chat:
                    return this.handleChat(socketMessage, socket);
                case WebSocketType.userUpdate:
                    return this.sendUserList(socketMessage.roomId, socket);
                default:
                    return;
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleJoin(subscribeMessage: WebSocketMessage, socket: WebSocket) {
        try {
            const roomId = subscribeMessage.roomId;
            if (!roomId) throw new Error("Missing roomId");

            // Parse user information from the subscribe message payload
            let user = this.wsUserMap.get(socket);
            
            // If user info was provided in the payload, use it
            if (subscribeMessage.payload && 'userId' in subscribeMessage.payload && 'userName' in subscribeMessage.payload) {
                user = {
                    userId: subscribeMessage.payload.userId as string,
                    userName: subscribeMessage.payload.userName as string,
                    joinedAt: new Date().toISOString()
                };
            } 
            // otherwise generate default user info
            else if (!user) {
                user = {
                    userId: Math.random().toString(36).substring(2, 10),
                    userName: `User-${Math.floor(Math.random() * 1000)}`,
                    joinedAt: new Date().toISOString()
                };
            }
            
            // Update or add the user in the map
            this.wsUserMap.set(socket, user);

            // Add socket to the room
            if (!this.wsSubscription.has(roomId)) {
                this.wsSubscription.set(roomId, new Set<WebSocket>());
            }
            this.wsSubscription.get(roomId)?.add(socket);

            console.log(`User ${user.userName} (${user.userId}) subscribed to room ${roomId}`);
            
            // Send the user their own user info
            const userInfoMessage: WebSocketMessage = {
                type: WebSocketType.userUpdate,
                roomId,
                payload: {
                    userCount: 1,
                    currentUser: user
                }
            };
            socket.send(JSON.stringify(userInfoMessage));
            
            // Broadcast user list and count to all users in the room
            this.broadcastUserList(roomId);
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

            const roomSockets = this.wsSubscription.get(roomId);
            if (!roomSockets) return;

            roomSockets.delete(socket);
            
            // Don't delete the user from wsUserMap here as they might be in other rooms
            
            if (roomSockets.size === 0) {
                this.wsSubscription.delete(roomId);
            } else {
                this.broadcastUserList(roomId);
                this.broadcastUserCount(roomId);
            }
            
            console.log(`User left room ${roomId}`);
        } catch (error) {
            return this.handleError(error);
        }
    }

    private broadcastUserCount(roomId: string) {
        const sockets = this.wsSubscription.get(roomId);
        if (!sockets) return;

        const userCountMessage: WebSocketMessage = {
            type: WebSocketType.userUpdate,
            roomId,
            payload: {
                userCount: sockets.size
            },
        };

        const messageStr = JSON.stringify(userCountMessage);
        console.log("Users online in room", roomId, ":", sockets.size);

        sockets.forEach((s) => {
            s.send(messageStr);
        });
    }
    
    private sendUserList(roomId: string, socket: WebSocket) {
        const sockets = this.wsSubscription.get(roomId);
        if (!sockets) return;
        
        const users: User[] = Array.from(sockets)
            .map((s) => this.wsUserMap.get(s))
            .filter(Boolean) as User[];
            
        const userListMessage: WebSocketMessage = {
            type: WebSocketType.userList,
            roomId,
            payload: {
                users
            }
        };
        
        socket.send(JSON.stringify(userListMessage));
    }
    
    private broadcastUserList(roomId: string) {
        const sockets = this.wsSubscription.get(roomId);
        if (!sockets) return;
        
        const users: User[] = Array.from(sockets)
            .map((s) => this.wsUserMap.get(s))
            .filter(Boolean) as User[];
            
        const userListMessage: WebSocketMessage = {
            type: WebSocketType.userList,
            roomId,
            payload: {
                users
            }
        };
        
        const messageStr = JSON.stringify(userListMessage);
        
        sockets.forEach((s) => {
            s.send(messageStr);
        });
    }

    private handleError(error: unknown) {
        console.error(error);
        return error;
    }
}