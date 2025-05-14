import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomSession } from '../../api/auth/[...nextauth]/options';

interface UserState {
  session: CustomSession | null;
  setSession: (session: CustomSession) => void;
  clearSession: () => void;
}

export const useSessionStore = create<UserState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }), //
      clearSession: () => set({ session: null }),
    }),
    {
      name: 'userSessionZustand', 
    }
  )
);
