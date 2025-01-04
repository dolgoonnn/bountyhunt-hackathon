// app/bounties/[id]/page.tsx
import { BountyDetails } from "@/components/bounties/bounty-detail";
import { SubmissionList } from "@/components/submissions/submission-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BountyPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <BountyDetails id={params.id} />
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Submissions</h2>
          <Link href={`/bounties/${params.id}/submit`}>
            <Button>Submit Solution</Button>
          </Link>
        </div>
        <SubmissionList bountyId={params.id} />
      </div>
    </div>
  );
}