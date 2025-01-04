import type { Bounty } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Coins, Users } from "lucide-react";

export function BountyCard({ bounty }: { bounty: Bounty }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-gray-700 hover:shadow-inner hover:shadow-purple-500 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <motion.h3 
              className="text-xl font-semibold text-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {bounty.title}
            </motion.h3>
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
        </CardHeader>
        
        <CardContent className="mt-4">
          <p className="line-clamp-2 text-gray-300">
            {bounty.description}
          </p>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <motion.div 
              className="rounded-lg bg-gray-800/50 p-4 flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <Coins className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Reward</p>
                <p className="font-semibold text-gray-200">{bounty.reward} ETH</p>
              </div>
            </motion.div>

            <motion.div 
              className="rounded-lg bg-gray-800/50 p-4 flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Submissions</p>
                <p className="font-semibold text-gray-200">{bounty._count.submissions}</p>
              </div>
            </motion.div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="h-4 w-4" />
            <p className="text-sm">
              Posted {formatDistance(bounty.createdAt)}
            </p>
          </div>
          
          <Link href={`/bounties/${bounty.id}`}>
            <Button 
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none"
            >
              View Details
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}