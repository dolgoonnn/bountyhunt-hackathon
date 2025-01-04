"use client";

import { api } from "@/trpc/react";
import { SubmissionCard } from "./submission-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

export function SubmissionList({ bountyId }: { bountyId: string }) {
  const { session } = useAuth();
  const { data: submissions, isLoading } = api.submission.list.useQuery({
    bountyId,
  });
  
  // Query to get bounty details including creator
  const { data: bounty } = api.bounty.getById.useQuery(bountyId);

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
      {submissions.items.map((submission) => {
        const isOwnSubmission = submission.submitter.id === session?.user.id;
        const isBountyCreator = bounty?.creator.id === session?.user.id;
        const canViewSubmission = isOwnSubmission || isBountyCreator;
        
        // If user can't view the submission, render just the card without a link
        if (!canViewSubmission) {
          return (
            <div 
              key={submission.id}
              className="opacity-50 cursor-not-allowed"
            >
              <SubmissionCard submission={submission} />
            </div>
          );
        }

        // If user can view the submission (their own or they're the bounty creator), render with a link
        return (
          <Link
            key={submission.id}
            href={`/bounties/${bountyId}/submissions/${submission.id}`}
            className="block transition-opacity hover:opacity-80"
          >
            <SubmissionCard submission={submission} />
          </Link>
        );
      })}
    </div>
  );
}