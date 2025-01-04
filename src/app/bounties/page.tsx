import { BountyFilters } from "@/components/bounties/bounty-filter";
import { BountyList } from "@/components/bounties/bounty-list";
import { motion } from "framer-motion";


export default function BountiesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-white">Available Bounties</h1>
        <p className="text-gray-100">
          Discover and work on exciting development bounties
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <BountyFilters />
        </aside>
        <main className="lg:col-span-3">
          <BountyList />
        </main>
      </div>
    </div>
  );
}
