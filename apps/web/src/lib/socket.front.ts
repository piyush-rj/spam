type Handler = (payload: any) => void;
type EventType = "connect" | "disconnect" | "reconnecting";

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private URL: string;

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;

  private isConnected = false;
  private messageQueue: { type: string; payload: any }[] = [];
  private messageHandlers = new Map<string, Handler[]>();
  private subscribedRooms = new Set<string>();

  private eventHandlers = new Map<EventType, Handler[]>();

  constructor(URL: string) {
    this.URL = URL;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.URL);

    this.ws.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectTimeout = 1000;

      while (this.messageQueue.length > 0) {
        const { type, payload } = this.messageQueue.shift()!;
        this.send(type, payload);
      }

      // Resubscribe to rooms after reconnect
      this.subscribedRooms.forEach((roomId) => {
        this.send("subscribe room", { roomId });
      });

      this.emit("connect");

      console.log("WebSocket connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.log("Error parsing message", error);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket closed");
      this.isConnected = false;
      this.emit("disconnect");
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.log("WebSocket error", error);
      this.isConnected = false;
      this.emit("disconnect");
      this.handleReconnect();
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnect attempts reached");
      return;
    }

    const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts++);
    console.log(`Reconnecting in ${timeout}ms`);

    this.emit("reconnecting");

    setTimeout(() => {
      this.connect();
    }, timeout);
  }

  private handleMessage(message: any) {
    const handlers = this.messageHandlers.get(message.type) || [];

    handlers.forEach((handler) => {
      try {
        handler(message.payload);
      } catch (error) {
        console.log(`Error in handler for type ${message.type}: `, error);
      }
    });
  }

  public send(type: string, payload: any) {
    const message = {
      type,
      payload,
      timestamp: Date.now(),
    };

    if (!this.isConnected || this.ws?.readyState !== WebSocket.OPEN) {
      this.messageQueue.push({ type, payload });
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error("Send error: ", error);
      this.messageQueue.push({ type, payload });
    }
  }

  public subscribe(type: string, handler: Handler) {
    const handlers = this.messageHandlers.get(type) || [];
    this.messageHandlers.set(type, [...handlers, handler]);

    return () => {
      const updated = (this.messageHandlers.get(type) || []).filter((h) => h !== handler);
      this.messageHandlers.set(type, updated);
    };
  }

  public subscribeToRoom(roomId: string) {
    if (!this.subscribedRooms.has(roomId)) {
      this.subscribedRooms.add(roomId);
      this.send("subscribe room", { roomId });
    }
  }

  public unsubscribeFromRoom(roomId: string) {
    if (this.subscribedRooms.has(roomId)) {
      this.subscribedRooms.delete(roomId);
      this.send("unsubscribe room", { roomId });
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

  // Event emitter methods
  public on(event: EventType, handler: Handler) {
    const handlers = this.eventHandlers.get(event) || [];
    this.eventHandlers.set(event, [...handlers, handler]);
  }

  public off(event: EventType, handler: Handler) {
    const handlers = (this.eventHandlers.get(event) || []).filter((h) => h !== handler);
    this.eventHandlers.set(event, handlers);
  }

  private emit(event: EventType) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach((handler) => {
      try {
        handler(null);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  public close() {
    if(this.ws) this.ws?.close();
  }
}
