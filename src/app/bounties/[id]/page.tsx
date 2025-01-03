import { BountyDetails } from "@/components/bounties/BountyDetails";
import { SubmissionList } from "@/components/submissions/SubmissionList";

export default function BountyPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <BountyDetails id={params.id} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Submissions</h2>
        <SubmissionList bountyId={params.id} />
      </div>
    </div>
  );
}