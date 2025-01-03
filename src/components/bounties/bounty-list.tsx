"use client";

import { api } from "@/lib/api";
import { BountyCard } from "./BountyCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function BountyList() {
  const { data, isLoading } = api.bounty.list.useQuery({
    limit: 10,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid gap-4">
      {data?.items.map((bounty) => (
        <BountyCard key={bounty.id} bounty={bounty} />
      ))}
    </div>
  );
}