import { CreateBountyForm } from "@/components/bounties/CreateBountyForm";

export default function CreateBountyPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-4xl font-bold mb-8">Create a New Bounty</h1>
      <CreateBountyForm />
    </div>
  );
}