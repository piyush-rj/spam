export class WebSocketClient {
    
    private ws: WebSocket | null = null;
    private URL: string;

    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout = 1000;

    private isConnected = false;
    private messageQueue: { type: string, payload: any }[] = [];
    private messageHandlers = new Map<string, ((payload: any) => void)[]>();
    private subscribedRooms = new Set<string>()


    constructor (URL: string) {
        this.URL = URL;
        this.connect();
    }

    private connect() {
        this.ws = new WebSocket(this.URL);

        this.ws.onopen = () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.reconnectTimeout = 1000;

            while(this.messageQueue.length > 0) {
                const { type, payload } = this.messageQueue.shift();
                this.send(type, payload)
            }

            this.subscribedRooms.forEach((roomId) => {
                this.send("subscribe room", { roomId }) 
            })

            console.log("websocket connected");
        };

        this.ws.onmessage= (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (error) {
                console.error("error parsing message", error)
            }
        }


        this.ws.onclose = () => {
            console.log("websocket closed")
            this.isConnected = false;
            this.handleReconnect();
        }

        this.ws.onerror = (error) => {
            console.error("websocket error", error);
            this.isConnected = false;
            this.handleReconnect();
        }
    }


    private handleReconnect() {
        if(this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error("max reconnect attempts reached")
            return;
        }

        const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts++);
        console.log(`reconnecting in ${timeout}ms`);

        setTimeout(() => {
            this.connect();
        }, timeout)
    }


    private handleMessage(message: any) {
        const handlers = this.messageHandlers.get(message.type) || [];

        handlers.forEach(handler => {
            try {
                handler(message.payload);
            } catch (error) {
                console.error(`error in handler for type ${message.type} : `, error)
            }
        })
    }


    public send(type: string, payload: any) {
        const message = {
            type,
            payload,
            timestamp: Date.now()
        }

        if(!this.isConnected || this.ws?.readyState !== WebSocket.OPEN) {
            this.messageQueue.push({ type, payload });
            return;
        }

        try {
            this.ws.send(JSON.stringify(message));
        } catch (error) {
            console.error("send error: ", error);
            this.messageQueue.push({ type, payload });
        }
    }


    public subscribe(type: string, handler: (payload: any) => void) {
        const handlers = this.messageHandlers.get(type) || [];
        this.messageHandlers.set(type, [...handlers, handler]);

        return () => {
            const updated = (this.messageHandlers.get(type) || []).filter(h => h !== handler);
            this.messageHandlers.set(type, updated)
        }
    }


    public subscribeToRoom(roomId: string) {
        if(!this.subscribedRooms.has(roomId)) {
            this.subscribedRooms.add(roomId);
            this.send("subscribed to room : ", roomId)
        }
    }


    public unsubscribeFromRoom(roomId: string) {
        if(this.subscribedRooms.has(roomId)) {
            this.subscribedRooms.delete(roomId);
            this.send("unsubscribed to room", { roomId });
        }
    }

    public isReady(): boolean {
        return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
    }

    public getState(): "connected" | "reconnecting" | "connecting" | "disconnected" {
        if (this.isConnected) return "connected";
        if (this.reconnectAttempts > 0) return "reconnecting";
        if (this.ws?.readyState === WebSocket.CONNECTING) return "connecting";
        return "disconnected";
    }


}