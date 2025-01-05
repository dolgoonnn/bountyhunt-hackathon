// src/stores/auth.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type Session } from "@/server/auth/types";

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const createNoopStorage = () => {
  return {
    getItem: (_name: string) => {
      return Promise.resolve(null);
    },
    setItem: (_name: string, _value: string) => {
      return Promise.resolve();
    },
    removeItem: (_name: string) => {
      return Promise.resolve();
    },
  };
};


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => {
        // Check if window is defined (client-side)
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return createNoopStorage();
      }),
    },
  ),
);