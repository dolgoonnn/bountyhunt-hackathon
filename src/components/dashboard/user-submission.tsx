"use client";

import { api } from "@/trpc/react";
import { SubmissionCard } from "@/components/submissions/submission-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "../providers/AuthProvider";

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
    <div className="space-y-4">
      {submissions?.items?.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
    </div>
  );
}
