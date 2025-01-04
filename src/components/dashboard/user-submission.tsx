"use client";

import { api } from "@/trpc/react";
import { SubmissionCard } from "@/components/submissions/submission-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";

export function UserSubmissions() {
  const { data: submissions, isLoading } =
    api.submission.listUserSubmissions.useQuery({});

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!submissions?.items?.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        You haven&apos;t submitted any solutions yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-5">
      {submissions?.items?.map((submission) => (
        <Link className="" key={submission.bounty.id} href={`/bounties/${submission.bounty.id}/submissions/${submission.id}`}>
          <SubmissionCard key={submission.id} submission={submission} />
        </Link>
      ))}
    </div>
  );
}
