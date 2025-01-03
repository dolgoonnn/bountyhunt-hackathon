"use client";

import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function UserStats() {
  const { data: stats, isLoading } = api.user.getStats.useQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Reputation
        </h3>
        <p className="text-2xl font-bold">{stats.reputation}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Active Bounties
        </h3>
        <p className="text-2xl font-bold">{stats.activeBounties}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Completed Submissions
        </h3>
        <p className="text-2xl font-bold">{stats.completedSubmissions}</p>
      </Card>
    </div>
  );
}
