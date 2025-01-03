// src/stores/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Session } from "@/server/auth/types";

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: 'auth-storage',
    }
  )
);