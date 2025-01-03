import { WagmiProviderContext } from "@/components/providers/wagmi-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <TRPCReactProvider>
      <WagmiProviderContext>
          <AuthProvider>
            <body className={inter.className}>{children}</body>
          </AuthProvider>
        </WagmiProviderContext>
      </TRPCReactProvider>
    </html>
  );
}
