"use client";

import { WagmiProvider, createConfig, createStorage, http } from "wagmi";
import { defineChain } from "viem";

export const educhain = defineChain({
  id: 656476,
  name: "EDU",
  nativeCurrency: { name: "EDU", symbol: "EDU", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://open-campus-codex-sepolia.drpc.org"] },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://edu-chain-testnet.blockscout.com/",
    },
  },
});

const createNoopStorage = () => {
  return {
    getItem: (_key: string) => {
      return null;
    },
    setItem: (_key: string, _value: string) => {
      return undefined;
    },
    removeItem: (_key: string) => {
      return undefined;
    },
  };
};

const storage = createStorage({
  storage: typeof window !== "undefined"
    ? window.localStorage
    : createNoopStorage(),
  key: "wagmi.cache",
});


const config = createConfig({
  chains: [educhain],
  transports: {
    [educhain.id]: http("https://open-campus-codex-sepolia.drpc.org"),
  },
  storage: storage,
});

export function WagmiProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
