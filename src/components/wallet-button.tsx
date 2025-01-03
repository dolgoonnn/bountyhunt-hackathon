// // src/components/WalletButton.tsx
// "use client";

// import { Button } from "@/components/ui/button";
// import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { injected } from "@wagmi/connectors";

// import { useAuth } from "./providers/AuthProvider";

// export const WalletButton = () => {
//   const { address, isConnected } = useAccount();
//   const { connect } = useConnect();
//   const { disconnect } = useDisconnect();
//   const { session, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <Button variant="outline" disabled>
//         Loading...
//       </Button>
//     );
//   }

//   if (isConnected) {
//     return (
//       <Button variant="outline" onClick={() => disconnect()}>
//         {address?.slice(0, 6)}...{address?.slice(-4)}
//       </Button>
//     );
//   }

//   return (
//     <Button onClick={() => connect({ connector: injected() })}>
//       Connect Wallet
//     </Button>
//   );
// };


"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from "@wagmi/connectors";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2 } from "lucide-react";

export const WalletButton = () => {
  const { address, isConnected ,chain} = useAccount();
  console.log("🚀 ~ WalletButton ~ chain:", chain)
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { session, isLoading: isAuthLoading } = useAuth();

  // Loading state when connecting or authenticating
  if (isAuthLoading) {
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
            {chain?.name ?? 'Unknown Network'} • {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            className="flex justify-between"
            disabled
          >
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

  // Connected but not authenticated state
  if (isConnected && !session) {
    return (
      <Button variant="outline"   onClick={() => disconnect()}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
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

// Optional: Activity Indicator Component
const ActivityIndicator = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin ${className ?? "h-4 w-4"}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);