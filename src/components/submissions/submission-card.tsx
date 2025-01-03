import { type RouterOutputs } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "@/lib/utils";

type Submission = RouterOutputs["submission"]["list"][0];

export function SubmissionCard({ submission }: { submission: Submission }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Submitted by {submission.submitter.address.slice(0, 6)}...
            {submission.submitter.address.slice(-4)}
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {formatDistance(submission.createdAt)}
          </span>
        </div>
        <Badge variant={getStatusVariant(submission.status)}>
          {submission.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{submission.content}</p>
        {submission.aiScore && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              AI Score: {submission.aiScore}/100
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getStatusVariant(status: Submission["status"]) {
  switch (status) {
    case "ACCEPTED":
      return "success";
    case "REJECTED":
      return "destructive";
    case "IMPROVED":
      return "warning";
    default:
      return "secondary";
  }
}
