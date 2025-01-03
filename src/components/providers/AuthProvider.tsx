// src/components/providers/AuthProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { type Session } from "@/server/auth/types";

import { api } from "@/trpc/react";
import { useAuthStore } from "@/hooks/useAuthStore";
interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, setSession } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const { data: messageToSign } = api.user.getMessageToSign.useQuery(
    undefined,
    {
      enabled: isConnected && !!address && !session,
    },
  );

  const { mutateAsync: verifyLogin } = api.user.verifyLogin.useMutation();

  const handleLogin = async () => {
    if (!address || !messageToSign) return console.log("address or messageToSign is required");

    try {
      const signature = await signMessageAsync({ message: messageToSign });
      console.log("🚀 ~ handleLogin ~ signature:", signature)
      const result = await verifyLogin({ address, signature });
      console.log("🚀 ~ handleLogin ~ result:", result)
      setSession(result);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };


    // Handle wallet connection/disconnection
    useEffect(() => {
      const init = async () => {
        if (isConnected && address) {
          if (!session) {
            await handleLogin();
          }
        } else {
          setSession(null);
        }
        setIsLoading(false);
      };

      void init();
    }, [isConnected, address]);

      // Verify session is still valid on page load
  useEffect(() => {
    const verifySession = async () => {
      if (session && (!isConnected || session.user.address !== address)) {
        setSession(null);
      }
      setIsLoading(false);
    };

    void verifySession();
  }, []);

  useEffect(() => {
    if (isConnected && address && !session) {
      void handleLogin().finally(() => setIsLoading(false));
    } else if (!isConnected) {
      setSession(null);
      setIsLoading(false);
    }
  }, [isConnected, address]);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
