"use client";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistance } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Coins, FileText, ListChecks, User } from "lucide-react";

export function BountyDetails({ id }: { id: string }) {
  const { data: bounty, isLoading } = api.bounty.getById.useQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!bounty) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50">
        <h2 className="text-2xl font-bold text-gray-300">Bounty not found</h2>
        <p className="text-gray-400 mt-2">This bounty may have been deleted or doesn&apos;t exist</p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-gray-700">
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-700/50">
          <div className="flex items-start justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="mb-2 text-3xl font-bold text-gray-200">{bounty.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{bounty.creator.address.slice(0, 6)}...{bounty.creator.address.slice(-4)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDistance(bounty.createdAt)}</span>
                </div>
              </div>
            </motion.div>
            <Badge 
              variant={bounty.isOpen ? "default" : "secondary"}
              className={`transition-all duration-300 ${
                bounty.isOpen 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                  : 'bg-gradient-to-r from-gray-500 to-slate-500'
              }`}
            >
              {bounty.status}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/30 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-200">Description</h2>
            </div>
            <p className="whitespace-pre-wrap text-gray-300">
              {bounty.description}
            </p>
          </motion.div>

          {/* Requirements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/30 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-200">Requirements</h2>
            </div>
            <ul className="list-inside space-y-3">
              {bounty.requirements.map((req, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-gray-300 flex items-start gap-2"
                >
                  <span className="inline-block w-2 h-2 mt-2 rounded-full bg-purple-400" />
                  {req}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Footer Section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/30 rounded-lg p-4 flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <Coins className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Reward</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {bounty.reward} ETH
                </p>
              </div>
            </motion.div>

            {bounty.isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href={`/bounties/${id}/submit`}>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none group"
                  >
                    Submit Solution
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}