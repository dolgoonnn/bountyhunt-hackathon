"use client";

import { api } from "@/lib/api";
import { SubmissionCard } from "./submission-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function SubmissionList({ bountyId }: { bountyId: string }) {
  const { data: submissions, isLoading } = api.submission.list.useQuery({
    bountyId,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!submissions?.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No submissions yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
    </div>
  );
}
