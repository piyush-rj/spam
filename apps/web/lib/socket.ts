import WebSocket, { Server, WebSocketServer } from "ws"
import { WebSocketMessage, WebSocketType } from "../types/WebSocketTypes";
import { error } from "console";


export class WebSocketClass {

    private wss: WebSocketServer;
    private wsSubscription: Map<String, Set<WebSocket>>;
    // < room1, <user1, user2, ...> >
    // < <very personal, <gunnu, sinu, anjan> >, <funtoosh collection, < piyush, anjan, nayan >> >

    constructor (server: Server) {
        this.wss = new WebSocketServer();
        this.wsSubscription = new Map<string, Set<WebSocket>>();

        this.init;
    }


    private init(){
        this.wss.on("connection", (socket) => {
            socket.on("message", (message: string) => {
                this.handleMessage(message, socket);
            })
        })
    }

    private handleMessage(message: string, socket: WebSocket){

        const socketMessage: WebSocketMessage = JSON.parse(message)

        switch(socketMessage.type){

            case "subscribe":
                return this.handleJoin(socketMessage, socket);

            case "unsubscribe":
                return this.handleLeave(socketMessage, socket);

            case "chat":
                return this.handleChat(socketMessage, socket);

            default:
                return;
        }
    }


    private handleJoin(subscribeMessage: WebSocketMessage, socket: WebSocket){

        try {
            const roomId = subscribeMessage.roomId;

            if(!roomId) this.handleError(error);

            if(!this.wsSubscription.has(roomId)){
                this.wsSubscription.set(roomId, new Set<WebSocket>)
            }

            this.wsSubscription.get(roomId)?.add(socket)
        } catch (error) {
            this.handleError(error)
        }
    }


    private handleChat(chatMessage: WebSocketMessage, socket: WebSocket) {

        try {
            if(chatMessage.type !== "chat") return;

            const message = JSON.stringify(chatMessage)
            if(!message) return;

            const roomId = chatMessage.roomId;
            const sockets = this.wsSubscription.get(roomId)

            if(!sockets) return;

            sockets.forEach((s) => {
                s.send(message)
            })
        } catch (error) {
            this.handleError(error)
        }
    }


    private handleLeave(unsubscribeMessage: WebSocketMessage, socket: WebSocket){

        try {
            const roomId = unsubscribeMessage.roomId;

            if(!roomId) return;
            
            this.wsSubscription.get(roomId)?.delete(socket)

            if( this.wsSubscription.get(roomId)?.size === 0 ) {
                this.wsSubscription.delete(roomId)
            }
              
        } catch (error) {
           return this.handleError(error); 
        }
    }


    private handleError(error: unknown){
        return error;
    }
}