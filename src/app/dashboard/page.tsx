import { UserStats } from "@/components/dashboard/user-stats";
import { UserBounties } from "@/components/dashboard/user-bounties";
import { UserSubmissions } from "@/components/dashboard/user-submission";
import { WalletButton } from "@/components/wallet-button";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between">

      <h1 className="mb-8 text-4xl font-bold text-white">Dashboard</h1>
      <WalletButton />
      </div>

      <div className="mb-8">
        <UserStats />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">Your Bounties</h2>
          <UserBounties />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">Your Submissions</h2>
          <UserSubmissions />
        </div>
      </div>

    </div>
  );
}
