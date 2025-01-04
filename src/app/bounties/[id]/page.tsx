// app/bounties/[id]/page.tsx
import { BountyDetails } from "@/components/bounties/bounty-detail";
import { SubmissionList } from "@/components/submissions/submission-list";
import { use } from "react";

interface BountyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BountyPage({ params }: BountyPageProps) {
  const resolvedParams = use(params);

  return (
    <div className="container mx-auto py-8">
      <BountyDetails id={resolvedParams.id} />
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Submissions</h2>
          {/* <Link href={`/bounties/${resolvedParams.id}/submit`}>
            <Button>Submit Solution</Button>
          </Link> */}
        </div>
        <SubmissionList bountyId={resolvedParams.id} />
      </div>
    </div>
  );
}