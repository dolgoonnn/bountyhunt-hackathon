// app/bounties/[id]/submit/page.tsx
"use client"

import { CreateSubmissionForm } from "@/components/submissions/create-submission-form";
export default function SubmitPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold text-white">Submit Solution</h1>
          <CreateSubmissionForm />
      </div>
    </div>
  );
}
