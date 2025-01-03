import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WalletButton } from "@/components/wallet-button";
// import Button
import { ArrowRight, Award, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <WalletButton/>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Decentralized Bounty Platform for Developers
          </h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            Create, complete, and earn from development bounties while building
            your reputation
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/bounties">
              <Button size="lg" className="gap-2">
                Explore Bounties <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/bounties/create">
              <Button size="lg" variant="outline" className="gap-2">
                Create Bounty
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose BountyBase?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-6">
              <Shield className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">
                Secure & Transparent
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Smart contract-based bounties ensure secure and transparent
                transactions
              </p>
            </Card>
            <Card className="p-6">
              <Award className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Build Reputation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Earn reputation points by completing bounties and contributing
                to the ecosystem
              </p>
            </Card>
            <Card className="p-6">
              <Zap className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Submissions are validated using AI to ensure quality and
                compliance
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
