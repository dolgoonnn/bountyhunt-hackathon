"use client";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistance } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { SubmissionStatus } from "@prisma/client";

export function SubmissionDetails({ id }: { id: string }) {
  const { toast } = useToast();

  const { data: submission, isLoading } = api.submission.getById.useQuery(id);

  const updateStatus = api.submission.updateStatus.useMutation({
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The submission status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!submission) {
    return <div>Submission not found</div>;
  }

  const handleStatusUpdate = (status: SubmissionStatus) => {
    updateStatus.mutate({ id: submission.id, status });
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link 
            href={`/bounties/${submission.bountyId}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← Back to Bounty
          </Link>
          <h1 className="mb-2 mt-4 text-2xl font-semibold">
            Submission for &quot;{submission.bounty.title}&quot;
          </h1>
          <p className="text-muted-foreground">
            Submitted by {submission.submitter.address.slice(0, 6)}...
            {submission.submitter.address.slice(-4)} •{" "}
            {formatDistance(submission.createdAt)}
          </p>
        </div>
        <Badge variant={getStatusVariant(submission.status)}>
          {submission.status}
        </Badge>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Solution</h2>
        <p className="whitespace-pre-wrap text-muted-foreground">
          {submission.content}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Submitted by</h2>
        <p className="text-muted-foreground">
          Address: {submission.submitter.address}
          <br />
          Reputation: {submission.submitter.reputation}
        </p>
      </div>

      {submission.bounty.isOpen && 
       submission.bounty.status === "ACTIVE" && 
       submission.status === "PENDING" && (
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate("REJECTED")}
          >
            Reject
          </Button>
          <Button

            onClick={() => handleStatusUpdate("ACCEPTED")}
          >
            Accept
          </Button>
          <Button
            variant="secondary"

            onClick={() => handleStatusUpdate("IMPROVED")}
          >
            Request Improvements
          </Button>
        </div>
      )}

      {updateStatus && (
        <div className="mt-4 text-center text-muted-foreground">
          <LoadingSpinner />
          Updating status...
        </div>
      )}
    </Card>
  );
}

function getStatusVariant(status: SubmissionStatus) {
  switch (status) {
    case "ACCEPTED":
      return "default" as const; // Changed from "success"
    case "REJECTED":
      return "destructive" as const;
    case "IMPROVED":
      return "outline" as const; // Changed from "warning"
    case "PENDING":
      return "secondary" as const;
    default:
      return "secondary" as const;
  }
}