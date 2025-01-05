"use client";

import { api } from "@/trpc/react";

import { BountyCard } from "./bounty-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function BountyList() {
  const { data, isLoading } = api.bounty.list.useQuery({
    limit: 10,

  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid gap-12">
      {data?.items.map((bounty) => (
        <BountyCard key={bounty.id} bounty={bounty} />
      ))}
    </div>
  );
}
