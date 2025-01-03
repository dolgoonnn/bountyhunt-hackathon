import { CreateBountyForm } from "@/components/bounties/create-bounty-form";
import { WalletButton } from "@/components/wallet-button";

export default function CreateBountyPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <WalletButton/>

      <h1 className="mb-8 text-4xl font-bold">Create a New Bounty</h1>
      <CreateBountyForm />
    </div>
  );
}
