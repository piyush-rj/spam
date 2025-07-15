import { WebSocket, WebSocketServer } from "ws";
import { WebSocketType, type SocketType } from "./SocketTypes";
import type { Server } from "http";


export class WebSocketClass {

    private wss: WebSocketServer;
    private wsSubscription: Map<String, Set<WebSocket>>;

    constructor (server: Server) {
        this.wss = new WebSocketServer({ server });
        this.wsSubscription = new Map();

        this.init();
    }


    private init() {
        this.wss.on("connection", (socket) => {

            socket.on("message", (message: string) => {
                this.handleMessage(message, socket);
            })
        })
    }

    private handleMessage(message: string, socket: WebSocket) {

        const socketMessage: SocketType = JSON.parse(message);

        switch (socketMessage.type) {

            case WebSocketType.SUBSCRIBE:
                return this.handleSubscribe(socketMessage, socket);

            case WebSocketType.UNSUBSCRIBE:
                return this.handleUnsubscribe(socketMessage, socket);

            case WebSocketType.CHAT:
                return this.handleChat(socketMessage, socket);


            default:
                return;
        }
    }


    private handleSubscribe(subscribeMessage: SocketType, socket: WebSocket) {
        try {
            const roomId = subscribeMessage.roomId;
            if (!roomId) return;

            if (!this.wsSubscription.has(roomId)) {
                this.wsSubscription.set(roomId, new Set<WebSocket>)
            }

            this.wsSubscription.get(roomId)?.add(socket);
            
        } catch (error) {
            socket.send("room subscription failed")
        }
    }


    private handleUnsubscribe(unsubscribeMessage: SocketType, socket: WebSocket) {
        try {
            const roomId = unsubscribeMessage.roomId;
            if(!roomId) return;

            if(!this.wsSubscription.has(roomId)) {
                return;
            }

            this.wsSubscription.get(roomId)?.delete(socket);

            if(this.wsSubscription.get(roomId)?.size == 0) {
                this.wsSubscription.delete(roomId);
            }

        } catch (error) {
            socket.send("unsubscribe message failed")
        }
    }


    private handleChat(chatMessage: SocketType, socket: WebSocket) {
        try {

            if(chatMessage.type !== WebSocketType.CHAT) return;

            const { roomId, payload } = chatMessage;
            if (!roomId || !payload) return;

            const sockets: Set<WebSocket> | undefined = this.wsSubscription.get(roomId);
            if (!sockets) return;

            const message = JSON.stringify({
                type: WebSocketType.CHAT,
                roomId,
                payload
            })

            sockets.forEach((s) => {
                if(s.readyState === WebSocket.OPEN) {
                    s.send(message)
                }
            })


        } catch (error) {
            socket.send("handle chat failed")
        }
    }

}