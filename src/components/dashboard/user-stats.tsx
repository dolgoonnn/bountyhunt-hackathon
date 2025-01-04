"use client";

import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { Award, Target, CheckCircle } from "lucide-react";

export function UserStats() {
  const { data: stats, isLoading } = api.user.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (!stats) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const statCards = [
    {
      title: "Reputation",
      value: stats.reputation,
      icon: Award,
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400"
    },
    {
      title: "Active Bounties",
      value: stats.activeBounties,
      icon: Target,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Completed Submissions",
      value: stats.completedSubmissions,
      icon: CheckCircle,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400"
    }
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-3"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={item}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="h-full"
        >
          <Card className={`h-full p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-gray-700 hover:shadow-xl hover:shadow-inner hover:shadow-purple-500 transition-all duration-300`}>
            <div className="flex flex-col h-full">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient} mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">
                  {stat.title}
                </h3>
                <div className="relative">
                  <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 rounded-lg" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}