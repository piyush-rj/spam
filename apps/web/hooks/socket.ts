import { ChatPayload, WebSocketMessage } from "@/types/WebSocketTypes";


export class WebSocketManager {

    private ws: WebSocket | null;
    private handlers: Map<String, ((payload: any) => void)[]>;

    private isConnected: boolean = false;

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.handlers = new Map(); 

        this.init();
    }

    private init() {
        this.ws.onopen = () => {
            this.isConnected = true;

        }

        this.ws.onmessage = (payload: any) => {
            const incomingMessage = JSON.parse(payload);
            this.handleMessage(incomingMessage);
        }
    }

    private handleMessage (incomingMessage: WebSocketMessage) {
        const { type, payload } = incomingMessage;
        const messageHandlers = this.handlers.get(type) || [];
        
        messageHandlers.forEach(eachHandler => {
            eachHandler(payload)
        });

    }

}