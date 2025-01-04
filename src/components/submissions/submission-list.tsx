"use client";

import { api } from "@/trpc/react";
import { SubmissionCard } from "./submission-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";

export function SubmissionList({ bountyId }: { bountyId: string }) {
  const { data: submissions, isLoading } = api.submission.list.useQuery({
    bountyId,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!submissions?.items.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No submissions yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.items.map((submission) => (
        <Link
          key={submission.id}
          href={`/bounties/${bountyId}/submissions/${submission.id}`}
          className="block transition-opacity hover:opacity-80"
        >
          <SubmissionCard submission={submission} />
        </Link>
      ))}
    </div>
  );
}