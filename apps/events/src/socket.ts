import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

type ClientId = string;
type EventType = 'insert' | 'edit' | 'delete' | 'read' | string;
type RoomId = string;

interface WSMessage {
  type: 'subscribe' | 'unsubscribe' | 'publish' | 'dashboard';
  room?: RoomId;
  event?: EventType;
  data?: any;
}

type SubscriptionKey = string;

export class WebSocketClass {

  private wss: WebSocket.Server;
  private clients: Map<ClientId, WebSocket>;
  private subscriptions: Map<SubscriptionKey, Set<ClientId>>;
  private clientSubscriptions: Map<ClientId, Set<SubscriptionKey>>;

  constructor(server: HTTPServer) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.subscriptions = new Map();
    this.clientSubscriptions = new Map();

    this.init();
  }

  private init(): void {

    this.wss.on('connection', (ws: WebSocket) => {

      const clientId = uuidv4();
      this.clients.set(clientId, ws);
      this.clientSubscriptions.set(clientId, new Set());

      console.log(`Client connected: ${clientId}`);

      ws.send(JSON.stringify({ type: 'connection', clientId }));

      ws.on('message', (message: string) => {
        try {
          const parsedMessage: WSMessage = JSON.parse(message);
          this.handleMessage(clientId, parsedMessage);

        } catch (error) {
          console.error('Error parsing message:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(clientId);
      });
    });
  }


  // subacribe, unsubscribe, publish (notifications), dashboard
  private handleMessage(clientId: ClientId, message: WSMessage): void {
    const client = this.clients.get(clientId);

    if (!client) {
      console.error(`Client not found: ${clientId}`);
      return;
    }

    switch (message.type) {

      case 'dashboard':
        client.send(JSON.stringify({
          type: 'dashboard_connected',
          message: 'Connected to dashboard'
        }));
        break;

      case 'subscribe':
        if (!message.room || !message.event) {
          client.send(JSON.stringify({
            type: 'error',
            message: 'Room and event are required for subscription'
          }));
          return;
        }

        this.subscribeClientToTopic(clientId, message.room, message.event);
        break;

      case 'unsubscribe':
        if (message.room && message.event) {
          // Unsubscribe from specific room/event
          this.unsubscribeClientFromTopic(clientId, message.room, message.event);
        } else if (message.room && !message.event) {
          this.unsubscribeClientFromRoom(clientId, message.room);
        } else {
          this.unsubscribeClientFromAllTopics(clientId);
        }
        break;

      case 'publish':
        if (!message.room || !message.event) {
          client.send(JSON.stringify({
            type: 'error',
            message: 'Room and event are required for publishing'
          }));
          return;
        }

        this.publishToTopic(message.room, message.event, message.data, clientId);
        break;

      default:
        client.send(JSON.stringify({
          type: 'error',
          message: 'Unknown message type'
        }));
    }
  }


  private getSubscriptionKey(room: RoomId, event: EventType): SubscriptionKey {
    return `${room}:${event}`;
  }
  

  private subscribeClientToTopic(clientId: ClientId, room: RoomId, event: EventType): void {
    const client = this.clients.get(clientId);

    if (!client) {
      console.error(`Client not found: ${clientId}`);
      return;
    }

    const subscriptionKey = this.getSubscriptionKey(room, event);

    if (!this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.set(subscriptionKey, new Set());
    }
    this.subscriptions.get(subscriptionKey)!.add(clientId);

    // Add to client subscriptions map
    this.clientSubscriptions.get(clientId)!.add(subscriptionKey);

    console.log("----------------------------------------------------------------------------------->")
    console.log("subscription: ", this.subscriptions, "\n client subscriptions: ", this.clientSubscriptions)

    client.send(JSON.stringify({
      type: 'subscribed',
      room,
      event,
      message: `Subscribed to ${room}:${event}`
    }));

    console.log(`Client ${clientId} subscribed to ${subscriptionKey}`);
  }

  private unsubscribeClientFromTopic(clientId: ClientId, room: RoomId, event: EventType): void {
    const client = this.clients.get(clientId);

    if (!client) {
      console.error(`Client not found: ${clientId}`);
      return;
    }

    const subscriptionKey = this.getSubscriptionKey(room, event);

    // Remove from subscriptions map
    const subscribers = this.subscriptions.get(subscriptionKey);
    if (subscribers) {
      subscribers.delete(clientId);
      if (subscribers.size === 0) {
        this.subscriptions.delete(subscriptionKey);
      }
    }

    // Remove from client subscriptions map
    const clientSubs = this.clientSubscriptions.get(clientId);
    if (clientSubs) {
      clientSubs.delete(subscriptionKey);
    }

    client.send(JSON.stringify({
      type: 'unsubscribed',
      room,
      event,
      message: `Unsubscribed from ${room}:${event}`
    }));

    console.log(`Client ${clientId} unsubscribed from ${subscriptionKey}`);
  }

  private unsubscribeClientFromRoom(clientId: ClientId, room: RoomId): void {
    const client = this.clients.get(clientId);

    if (!client) {
      console.error(`Client not found: ${clientId}`);
      return;
    }

    const clientSubs = this.clientSubscriptions.get(clientId);
    if (!clientSubs) return;

    // Find all subscriptions for this room
    const roomSubscriptions = Array.from(clientSubs)
      .filter(key => key.startsWith(`${room}:`));

    // Unsubscribe from each topic
    roomSubscriptions.forEach(subKey => {
      const [roomId, event] = subKey.split(':');
      this.unsubscribeClientFromTopic(clientId, roomId, event as EventType);
    });

    client.send(JSON.stringify({
      type: 'unsubscribed_room',
      room,
      message: `Unsubscribed from all events in room ${room}`
    }));
  }

  private unsubscribeClientFromAllTopics(clientId: ClientId): void {
    const client = this.clients.get(clientId);

    if (!client) {
      console.error(`Client not found: ${clientId}`);
      return;
    }

    const clientSubs = this.clientSubscriptions.get(clientId);
    if (!clientSubs) return;

    // Make a copy of the subscriptions to avoid iterator issues
    const subscriptions = Array.from(clientSubs);

    // Unsubscribe from each topic
    subscriptions.forEach(subKey => {
      const [room, event] = subKey.split(':');
      this.unsubscribeClientFromTopic(clientId, room, event as EventType);
    });

    client.send(JSON.stringify({
      type: 'unsubscribed_all',
      message: 'Unsubscribed from all topics'
    }));
  }



  private publishToTopic(room: RoomId, event: EventType, data: any, senderId: ClientId): void {
    const subscriptionKey = this.getSubscriptionKey(room, event);
    const subscribers = this.subscriptions.get(subscriptionKey);

    if (!subscribers || subscribers.size === 0) {
      console.log(`No subscribers for ${subscriptionKey}`);
      return;
    }

    const message = JSON.stringify({
      type: 'message',
      room,
      event,
      data,
      timestamp: new Date().toISOString()
    });

    subscribers.forEach(clientId => {
      // Don't send the message back to the sender if they're also subscribed
      if (clientId !== senderId) {
        const client = this.clients.get(clientId);
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      }
    });

    console.log(`Published to ${subscriptionKey}, received by ${subscribers.size - (subscribers.has(senderId) ? 1 : 0)} clients`);
  }


  private handleDisconnect(clientId: ClientId): void {
    // Unsubscribe from all topics
    this.unsubscribeClientFromAllTopics(clientId);

    // Clean up client data
    this.clients.delete(clientId);
    this.clientSubscriptions.delete(clientId);

    console.log(`Client disconnected: ${clientId}`);
  }

  
  // Public method to broadcast to all connected clients
  public broadcastAll(message: any): void {
    const messageStr = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
}

