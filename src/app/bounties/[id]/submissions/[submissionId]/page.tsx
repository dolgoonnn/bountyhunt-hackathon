// app/bounties/submission/[id]/page.tsx
"use client";

import { use } from "react";
import { SubmissionDetails } from "@/components/submissions/submission-detail";

interface SubmissionPageProps {
  params: Promise<{
    submissionId: string;
  }>;
}

export default function SubmissionPage({ params }: SubmissionPageProps) {
  const resolvedParams = use(params);

  return (
    <div className="container mx-auto py-8">
      {resolvedParams && <SubmissionDetails id={resolvedParams.submissionId} />}
    </div>
  );
}