"use client";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistance } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";

export function BountyDetails({ id }: { id: string }) {
  const { data: bounty, isLoading } = api.bounty.getById.useQuery(id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!bounty) {
    return <div>Bounty not found</div>;
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{bounty.title}</h1>
          <p className="text-muted-foreground">
            Posted by {bounty.creator.address.slice(0, 6)}...
            {bounty.creator.address.slice(-4)} •{" "}
            {formatDistance(bounty.createdAt)}
          </p>
        </div>
        <Badge variant={bounty.isOpen ? "default" : "secondary"}>
          {bounty.status}
        </Badge>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Description</h2>
        <p className="whitespace-pre-wrap text-muted-foreground">
          {bounty.description}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Requirements</h2>
        <ul className="list-inside list-disc space-y-1">
          {bounty.requirements.map((req, index) => (
            <li key={index} className="text-muted-foreground">
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Reward</p>
          <p className="text-2xl font-bold">{bounty.reward} ETH</p>
        </div>
        {bounty.isOpen && (
          <Link href={`/bounties/${id}/submit`}>
            <Button size="lg">Submit Solution</Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
