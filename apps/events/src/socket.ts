import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@repo/db';

type ClientId = string;
type EventType = 'chat:join' | 'chat:leave' | 'chat:message' | 'chat:user:joined' | 'chat:user:left';
type RoomId = string;

interface WSMessage {
  type: EventType | 'subscribe' | 'unsubscribe' | 'publish' | 'dashboard';
  room?: RoomId;
  data?: any;
}

type SubscriptionKey = string;

export class WebSocketClass {

  private wss: WebSocket.Server;
  private clients: Map<ClientId, WebSocket>;
  private subscriptions: Map<SubscriptionKey, Set<ClientId>>;
  private clientSubscriptions: Map<ClientId, Set<SubscriptionKey>>;

  // NEW: map clientId to user info {userId, name}
  private clientUserMap: Map<ClientId, { userId: string; name: string }>;

  // Keep track of users currently in rooms for presence broadcasts
  private roomUsers: Map<RoomId, Set<string>>; // roomId -> set of userIds

  constructor(server: HTTPServer) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.subscriptions = new Map();
    this.clientSubscriptions = new Map();
    this.clientUserMap = new Map();
    this.roomUsers = new Map();

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

  private async handleMessage(clientId: ClientId, message: WSMessage): Promise<void> {
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
        if (!message.room) {
          client.send(JSON.stringify({
            type: 'error',
            message: 'Room is required for subscription'
          }));
          return;
        }

        ['chat:message', 'chat:user:joined', 'chat:user:left'].forEach(eventType => {
          this.subscribeClientToTopic(clientId, message.room!, eventType as EventType);
        });
        break;

      case 'unsubscribe':
        if (message.room) {
          this.unsubscribeClientFromRoom(clientId, message.room);
        } else {
          this.unsubscribeClientFromAllTopics(clientId);
        }
        break;

      case 'chat:join':
        if (!message.room || !message.data?.userId || !message.data?.name) {
          client.send(JSON.stringify({ type: 'error', message: 'Room, userId and name required for chat:join' }));
          return;
        }
        // Save client user info mapping
        this.clientUserMap.set(clientId, { userId: message.data.userId, name: message.data.name });

        // Add user to room user set
        if (!this.roomUsers.has(message.room)) {
          this.roomUsers.set(message.room, new Set());
        }
        this.roomUsers.get(message.room)!.add(message.data.userId);

        // Subscribe client to room chat events
        ['chat:message', 'chat:user:joined', 'chat:user:left'].forEach(eventType => {
          this.subscribeClientToTopic(clientId, message.room!, eventType as EventType);
        });

        // Notify others in the room that a user joined
        this.publishToTopic(message.room, 'chat:user:joined', { userId: message.data.userId, name: message.data.name }, clientId);
        break;

      case 'chat:leave':
        if (!message.room) {
          client.send(JSON.stringify({ type: 'error', message: 'Room is required for chat:leave' }));
          return;
        }
        const userInfo = this.clientUserMap.get(clientId);
        if (userInfo && this.roomUsers.has(message.room)) {
          this.roomUsers.get(message.room)!.delete(userInfo.userId);

          // Notify others in the room user left
          this.publishToTopic(message.room, 'chat:user:left', userInfo.userId, clientId);
        }

        // Remove user from clientUserMap (optionally, if client leaves all rooms)
        this.clientUserMap.delete(clientId);

        // Unsubscribe client from all chat events in this room
        this.unsubscribeClientFromRoom(clientId, message.room);
        break;

      case 'chat:message':
        if (!message.room || !message.data?.content) {
          client.send(JSON.stringify({ type: 'error', message: 'Room and content required for chat:message' }));
          return;
        }
        // Get user info from client map
        const sender = this.clientUserMap.get(clientId);
        if (!sender) {
          client.send(JSON.stringify({ type: 'error', message: 'User not joined in any room' }));
          return;
        }

        // Save message to DB
        try {
          await prisma.chatMessage.create({
            data: {
              groupId: message.room,
              senderId: Number(sender.userId), // Adjust if your userId is string, use string instead
              content: message.data.content
            }
          });
        } catch (error) {
          console.error('DB error saving message:', error);
        }

        // Broadcast message to subscribers (including sender)
        this.publishToTopic(message.room, 'chat:message', {
          id: uuidv4(),
          sender: { id: sender.userId, name: sender.name },
          content: message.data.content,
          timestamp: new Date().toISOString()
        }, clientId);

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
    if (!client) return;

    const subscriptionKey = this.getSubscriptionKey(room, event);

    if (!this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.set(subscriptionKey, new Set());
    }
    this.subscriptions.get(subscriptionKey)!.add(clientId);

    this.clientSubscriptions.get(clientId)!.add(subscriptionKey);

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
    if (!client) return;

    const subscriptionKey = this.getSubscriptionKey(room, event);

    const subscribers = this.subscriptions.get(subscriptionKey);
    if (subscribers) {
      subscribers.delete(clientId);
      if (subscribers.size === 0) {
        this.subscriptions.delete(subscriptionKey);
      }
    }

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
    ['chat:message', 'chat:user:joined', 'chat:user:left'].forEach(event => {
      this.unsubscribeClientFromTopic(clientId, room, event as EventType);
    });
  }

  private unsubscribeClientFromAllTopics(clientId: ClientId): void {
    const clientSubs = this.clientSubscriptions.get(clientId);
    if (!clientSubs) return;

    for (const subscriptionKey of clientSubs) {
      const subscribers = this.subscriptions.get(subscriptionKey);
      if (subscribers) {
        subscribers.delete(clientId);
        if (subscribers.size === 0) this.subscriptions.delete(subscriptionKey);
      }
    }

    clientSubs.clear();
  }

  private publishToTopic(room: RoomId, event: EventType, data: any, exceptClientId?: ClientId): void {
    const subscriptionKey = this.getSubscriptionKey(room, event);
    const subscribers = this.subscriptions.get(subscriptionKey);

    if (!subscribers) return;

    const message = JSON.stringify({ type: event, room, data });

    for (const clientId of subscribers) {
      if (clientId === exceptClientId) continue;
      const client = this.clients.get(clientId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  private handleDisconnect(clientId: ClientId): void {
    console.log(`Client disconnected: ${clientId}`);

    // Remove from clients map
    this.clients.delete(clientId);

    // Remove from subscriptions
    this.unsubscribeClientFromAllTopics(clientId);

    // Remove user from roomUsers and broadcast leave event if needed
    const userInfo = this.clientUserMap.get(clientId);
    if (userInfo) {
      for (const [room, users] of this.roomUsers.entries()) {
        if (users.has(userInfo.userId)) {
          users.delete(userInfo.userId);
          this.publishToTopic(room, 'chat:user:left', userInfo.userId, clientId);
        }
      }
      this.clientUserMap.delete(clientId);
    }

    this.clientSubscriptions.delete(clientId);
  }
}
