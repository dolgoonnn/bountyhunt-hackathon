// app/bounties/[id]/submit/page.tsx
import { CreateSubmissionForm } from "@/components/submissions/create-submission-form";
import { Card } from "@/components/ui/card";

interface SubmitPageProps {
  params: {
    id: string;
  }
}

export default function SubmitPage({ params }: SubmitPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Submit Solution</h1>
          <CreateSubmissionForm />
        </Card>
      </div>
    </div>
  );
}