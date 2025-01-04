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
  const [hasInitialized, setHasInitialized] = useState(false);

  const { address, isConnected, status } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const { data: messageToSign } = api.user.getMessageToSign.useQuery(
    undefined,
    {
      enabled: isConnected && !!address && !session,
    },
  );

  const { mutateAsync: verifyLogin } = api.user.verifyLogin.useMutation();

  const handleLogin = async () => {
    if (!address || !messageToSign) return;

    try {
      const signature = await signMessageAsync({ message: messageToSign });
      const result = await verifyLogin({ address, signature });
      setSession(result);
    } catch (error) {
      console.error("Login failed:", error);
      setSession(null);
    }
  };

  // Initial setup and wallet status check
  useEffect(() => {
    if (status === "disconnected") {
      setHasInitialized(true);
      setIsLoading(false);
      if (session) setSession(null);
    } else if (status === "connected" && address) {
      setHasInitialized(true);
      if (session && session.user.address !== address) {
        setSession(null);
      }
    }
  }, [status, address]);

  // Handle authentication
  useEffect(() => {
    if (!hasInitialized) return;

    const authenticate = async () => {
      setIsLoading(true);

      if (isConnected && address) {
        if (!session) {
          await handleLogin();
        }
      }

      setIsLoading(false);
    };

    void authenticate();
  }, [isConnected, address, hasInitialized, session?.user.address]);

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
