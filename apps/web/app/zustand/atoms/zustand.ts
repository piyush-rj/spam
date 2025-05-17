import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomSession } from '../../api/auth/[...nextauth]/options';
import axios from 'axios';

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

interface SocketState {
  socket: WebSocket | null;
  setSocket: (socket: WebSocket) => void;
  closeSocket: () => void;
};


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



export const useSocketStore = create<{
  
    socket: WebSocket | null;
    setSocket: (ws: WebSocket) => void;
    closeSocket: () => void;
  }>((set, get) => ({
    socket: null,
    setSocket: (ws) => set({ socket: ws }),
    closeSocket: () => {
      get().socket?.close();
      set({ socket: null });
  },
}));