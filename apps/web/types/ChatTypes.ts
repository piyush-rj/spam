import { WebSocketMessage, User, ChatPayload } from './WebSocketTypes';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  senderName?: string;
}

export interface RoomData {
  id: string;
  userCount: number;
  users: User[];
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export interface MessageBubbleProps {
  message: ChatPayload;
  isOwn: boolean;
  senderName?: string;
}

export interface UserItemProps {
  user: User;
  isCurrentUser: boolean;
}

export interface UserListProps {
  users: User[];
  currentUserId: string;
}

export interface RoomHeaderProps {
  roomId: string;
  userCount: number;
  onToggleUsersList: () => void;
  onLeaveRoom: () => void;
}

export interface JoinRoomProps {
  onJoinRoom: (roomId: string) => void;
  isConnected: boolean;
}

export interface ChatContainerProps {
  roomId: string;
  messages: WebSocketMessage[];
  users: User[];
  userCount: number;
  currentUserId: string;
  onSendMessage: (message: string) => void;
  onLeaveRoom: () => void;
}

export interface AppHeaderProps {
  connected: boolean;
  // userName: string;
  // userAvatar?: string | null;
  // isAuthenticated: boolean;
}

export interface ChatGroupType {
  id : string,
  user_id : number,
  title : string,
  passcode : string,
  createdAt : string
}

export interface CustomUser {
  id: string;
  fullName?: string | null;
  email?: string | null;
  image?: string | null;
  token?: string | null;
}