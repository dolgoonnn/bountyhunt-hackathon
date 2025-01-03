import { BountyDetails } from "@/components/bounties/bounty-detail";
import { SubmissionList } from "@/components/submissions/submission-list";

export default function BountyPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <BountyDetails id={params.id} />
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Submissions</h2>
        <SubmissionList bountyId={params.id} />
      </div>
    </div>
  );
}
