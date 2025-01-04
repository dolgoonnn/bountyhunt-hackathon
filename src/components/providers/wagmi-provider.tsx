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

const storage = createStorage({
  storage: window.localStorage,
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
