import { WagmiProviderContext } from "@/components/providers/wagmi-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { TRPCReactProvider } from "@/trpc/react";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuestHub - Decentralized Bounty Platform",
  description: "Create, complete, and earn from development bounties while building your reputation",
};

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <WagmiProviderContext>
        <AuthProvider>
          <Navbar />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
        </AuthProvider>
      </WagmiProviderContext>
    </TRPCReactProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black min-h-screen`}>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}