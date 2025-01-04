"use client";

import { api } from "@/trpc/react";
import { BountyCard } from "@/components/bounties/bounty-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function UserBounties() {
  const { data: bounties, isLoading } = api.bounty.listUserBounties.useQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!bounties?.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        You haven&apos;t created any bounties yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bounties.map((bounty) => (
        <BountyCard key={bounty.id} bounty={bounty} />
      ))}
    </div>
  );
}
