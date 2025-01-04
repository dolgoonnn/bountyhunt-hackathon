import { useState } from "react";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistance } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { SubmissionStatus } from "@prisma/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SubmissionDetails({ id }: { id: string }) {
  const { toast } = useToast();
  const [isRecalculating, setIsRecalculating] = useState(false);

  const {
    data: submission,
    isLoading,
    refetch
  } = api.submission.getById.useQuery(id);

  const updateStatus = api.submission.updateStatus.useMutation({
    onSuccess:async () => {
      toast({
        title: "Status updated",
        description: "The submission status has been updated successfully",
      });
      await refetch();
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const recalculateScore = api.submission.recalculateScore.useMutation({
    onSuccess: async (updatedSubmission) => {
      setIsRecalculating(false);
      toast({
        title: "Score recalculated",
        description: `New AI score: ${updatedSubmission.aiScore ?? 'N/A'}`,
      });
      await refetch();
    },
    onError: (error) => {
      setIsRecalculating(false);
      toast({
        title: "Error recalculating score",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!submission) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Submission not found</AlertDescription>
      </Alert>
    );
  }

  const handleStatusUpdate = (status: SubmissionStatus) => {
    updateStatus.mutate({ id: submission.id, status });
  };

  const handleRecalculateScore = () => {
    setIsRecalculating(true);
    recalculateScore.mutate(submission.id);
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
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
        <div className="flex flex-col items-end gap-2">
          <Badge variant={getStatusVariant(submission.status)}>
            {submission.status}
          </Badge>
          {submission.aiScore !== null && (
            <div className={`text-sm font-medium ${getScoreColor(submission.aiScore)}`}>
              AI Score: {submission.aiScore}/100
            </div>
          )}
        </div>
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
        <div className="space-y-4">
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate("REJECTED")}
            >
              {updateStatus ? <LoadingSpinner /> : "Reject"}
            </Button>
            <Button
              onClick={() => handleStatusUpdate("ACCEPTED")}

            >
              {updateStatus ? <LoadingSpinner /> : "Accept"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleStatusUpdate("IMPROVED")}
            >
              {updateStatus ? <LoadingSpinner /> : "Request Improvements"}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleRecalculateScore}
              disabled={isRecalculating}
              className="mt-2"
            >
              {isRecalculating ? (
                <>
                  <LoadingSpinner />
                  Recalculating Score...
                </>
              ) : (
                "Recalculate AI Score"
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function getStatusVariant(status: SubmissionStatus) {
  switch (status) {
    case "ACCEPTED":
      return "default" as const;
    case "REJECTED":
      return "destructive" as const;
    case "IMPROVED":
      return "outline" as const;
    case "PENDING":
      return "secondary" as const;
    default:
      return "secondary" as const;
  }
}
