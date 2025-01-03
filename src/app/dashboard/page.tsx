import { UserStats } from "@/components/dashboard/UserStats";
import { UserBounties } from "@/components/dashboard/UserBounties";
import { UserSubmissions } from "@/components/dashboard/UserSubmissions";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="mb-8">
        <UserStats />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Bounties</h2>
          <UserBounties />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Submissions</h2>
          <UserSubmissions />
        </div>
      </div>
    </div>
  );
}