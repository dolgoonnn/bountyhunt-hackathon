"use client";

import { api } from "@/lib/api";
import { SubmissionCard } from "@/components/submissions/SubmissionCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function UserSubmissions() {
  const { data: submissions, isLoading } =
    api.submission.listUserSubmissions.useQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!submissions?.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        You haven't submitted any solutions yet
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
