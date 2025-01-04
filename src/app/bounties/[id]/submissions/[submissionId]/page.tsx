// app/bounties/submission/[id]/page.tsx
"use client";

import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SubmissionDetails } from "@/components/submissions/submission-detail";

interface SubmissionPageProps {
  params: {
    submissionId: string;
  };
}

export default function SubmissionPage({ params }: SubmissionPageProps) {
  // const router = useRouter();
  // const { data: submission, isLoading, error } = api.submission.getById.useQuery(params.submissionId);

  // if (isLoading) {
  //   return (
  //     <div className="container mx-auto py-8">
  //       <Card className="p-6">
  //         <div className="flex justify-center">
  //           <Loader className="h-6 w-6 animate-spin" />
  //         </div>
  //       </Card>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="container mx-auto py-8">
  //       <Card className="p-6">
  //         <div className="text-red-500">Error: {error.message}</div>
  //       </Card>
  //     </div>
  //   );
  // }

  // if (!submission) {
  //   return (
  //     <div className="container mx-auto py-8">
  //       <Card className="p-6">
  //         <div>Submission not found</div>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto py-8">
      {/* <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Submission Details</h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Bounty</h2>
            <div className="rounded-lg bg-muted p-4">
              <p className="font-medium">{submission.bounty.title}</p>
              <p className="text-sm text-muted-foreground">Reward: {submission.bounty.reward}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Status</h2>
            <div className="rounded-lg bg-muted p-4">
              <p>{submission.status}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Content</h2>
            <div className="rounded-lg bg-muted p-4">
              <pre className="whitespace-pre-wrap">{submission.content}</pre>
            </div>
          </div>

          {submission.bounty.creatorId === submission.submitterId && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Actions</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push(`/bounties/${submission.bountyId}`)}
                >
                  View Bounty
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card> */}
      {params && <SubmissionDetails id={params.submissionId} />}
    </div>
  );
}
