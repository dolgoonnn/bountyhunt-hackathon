"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "@wagmi/connectors";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2 } from "lucide-react";

export const WalletButton = () => {
  const { address, isConnected, chain, status } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { session, isLoading: isAuthLoading } = useAuth();
  console.log("🚀 ~ WalletButton ~ session:", session);

  // Initial loading state
  if (status === "connecting" || status === "reconnecting") {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting Wallet
      </Button>
    );
  }

  // Authentication loading state
  if (isAuthLoading && isConnected) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Authenticating
      </Button>
    );
  }

  // Connected and authenticated state
  if (isConnected && session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {chain?.name ?? "Unknown Network"} • {address?.slice(0, 6)}...
            {address?.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="flex justify-between" disabled>
            <span className="text-muted-foreground">Reputation</span>
            <span>{session.user.reputation ?? 0}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => disconnect()}
            className="text-red-600"
          >
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Connected but authentication failed or pending
  if (isConnected && !session) {
    return (
      <Button variant="outline" onClick={() => disconnect()}>
        Authentication Failed
      </Button>
    );
  }

  // Not connected state
  return (
    <Button
      onClick={() => connect({ connector: injected() })}
      className="bg-primary hover:bg-primary/90"
    >
      Connect Wallet
    </Button>
  );
};
