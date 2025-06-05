import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomSession } from '../../api/auth/[...nextauth]/options';
import axios from 'axios';
import { WebSocketClient } from '@/src/lib/socket.front';

interface UserState {
  session: CustomSession | null;
  setSession: (session: CustomSession) => void;
  clearSession: () => void;
}

interface User {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
}

interface GroupUser {
  id: number;
  user_id: number;
  group_id: string;
  user: {
    id: number;
    name: string | null;
    image: string | null;
  };
}

interface ChatGroup {
  id: string;
  user_id: number;
  title: string;
  passcode: string;
  createdAt: string;
  image: string | null;
  user: User;
  GroupUsers: GroupUser[];
}

interface GroupsState {
  groups: ChatGroup[];
  loading: boolean;
  error: string | null;
  fetchGroups: (userId: string) => Promise<void>;
}

type ConnectionState = "connected" | "connecting" | "disconnected" | "reconnecting";

interface SocketClientState {
  socketClient: WebSocketClient | null;
  connectionState: ConnectionState;
  isReady: boolean;
  setSocketClient: (client: WebSocketClient) => void;
  clearSocketClient: () => void;
  initializeSocketClient: () => void;
}

interface ChatState {
  activeGroupId: string | null;
  activeGroupName: string | null;
  setGroup: (id: string, name: string) => void;
  resetGroup: () => void;
}


interface ActiveUsersState {
  activeUsers: Record<string, string[]>;
  setUserActive: (roomId: string, userId: string) => void;
  setUserInactive: (roomId: string, userId: string | null | undefined) => void;
  clearRoomUsers: (roomId: string) => void;
}


export const useSessionStore = create<UserState>()(
  persist(
    (set) => ({
      // @ts-ignore
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: 'userSessionZustand',
    }
  )
);

export const useGroupsStore = create<GroupsState>((set) => ({
  groups: [],
  loading: false,
  error: null,
  fetchGroups: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<ChatGroup[]>(`http://localhost:8080/api/group/${userId}`);
      set({ groups: response.data });
    } catch (err) {
      set({ error: 'Failed to load groups. Please try again later.' });
    } finally {
      set({ loading: false });
    }
  },
}));

export const useSocketStore = create<SocketClientState>((set, get) => ({
  socketClient: null,
  connectionState: "disconnected",
  isReady: false,
  setSocketClient(client) {
    set({ socketClient: client })
  },
  clearSocketClient() {
    set({ socketClient: null, connectionState: "disconnected", isReady: false })
  },
  initializeSocketClient() {
    if(get().socketClient) return;

    const client = new WebSocketClient("ws://localhost:8080");

    set({ socketClient: client, connectionState: client.getState(), isReady: client.isReady() });

    client.on("connect", () => {
      set({ connectionState: "connected", isReady: true } )
    });
    client.on("disconnect", () => {
      set({ connectionState: client.getState(), isReady: false })
    });
    client.on("reconnecting", () => {
      set({ connectionState: "reconnecting", isReady: false })
    })
  }

}));

export const useChatStore = create<ChatState>((set) => ({
  activeGroupId: null,
  activeGroupName: null,
  setGroup: (id, name) => set({ activeGroupId: id, activeGroupName: name }),
  resetGroup: () => set({ activeGroupId: null, activeGroupName: null})
}))

export const useActiveUsersStore = create<ActiveUsersState>((set) => ({
  activeUsers: {},

  setUserActive: (roomId, userId) =>
    set((state) => {
      const existing = state.activeUsers[roomId] || [];
      if (!existing.includes(userId)) {
        return {
          activeUsers: {
            ...state.activeUsers,
            [roomId]: [...existing, userId],
          },
        };
      }
      return state;
    }),

  setUserInactive: (roomId, userId) =>
    set((state) => {
      const updatedUsers = (state.activeUsers[roomId] || []).filter((id) => id !== userId);
      return {
        activeUsers: {
          ...state.activeUsers,
          [roomId]: updatedUsers,
        },
      };
    }),

  clearRoomUsers: (roomId) =>
    set((state) => {
      const updated = { ...state.activeUsers };
      delete updated[roomId];
      return { activeUsers: updated };
    }),
}));



