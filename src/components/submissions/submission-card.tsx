import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistance } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, User, Bot, XCircle, Clock, RefreshCw, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";

type SubmissionWithRelations = {
  id: string;
  bountyId: string;
  submitterId: string;
  content: string;
  aiScore: number | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "IMPROVED";
  createdAt: Date;
  submitter: {
    id: string;
    address: string;
    reputation: number;
  };
};

function getStatusConfig(status: "PENDING" | "ACCEPTED" | "REJECTED" | "IMPROVED") {
  const configs = {
    ACCEPTED: {
      gradient: "from-green-500 to-emerald-500",
      hoverGradient: "hover:from-green-600 hover:to-emerald-600",
      icon: CheckCircle,
      iconColor: "text-green-400"
    },
    REJECTED: {
      gradient: "from-red-500 to-rose-500",
      hoverGradient: "hover:from-red-600 hover:to-rose-600",
      icon: XCircle,
      iconColor: "text-red-400"
    },
    IMPROVED: {
      gradient: "from-blue-500 to-cyan-500",
      hoverGradient: "hover:from-blue-600 hover:to-cyan-600",
      icon: RefreshCw,
      iconColor: "text-blue-400"
    },
    PENDING: {
      gradient: "from-yellow-500 to-amber-500",
      hoverGradient: "hover:from-yellow-600 hover:to-amber-600",
      icon: Clock,
      iconColor: "text-yellow-400"
    }
  };
  return configs[status];
}

function getGradeConfig(score: number) {
  if (score >= 90) return { 
    label: "Outstanding", 
    color: "from-emerald-400 to-green-400",
    description: "Exceptional quality submission"
  };
  if (score >= 80) return { 
    label: "Excellent", 
    color: "from-green-400 to-teal-400",
    description: "High quality submission"
  };
  if (score >= 70) return { 
    label: "Very Good", 
    color: "from-blue-400 to-cyan-400",
    description: "Above average submission"
  };
  if (score >= 60) return { 
    label: "Good", 
    color: "from-cyan-400 to-sky-400",
    description: "Meets expectations"
  };
  if (score >= 50) return { 
    label: "Fair", 
    color: "from-yellow-400 to-amber-400",
    description: "Needs some improvement"
  };
  if (score >= 30) return { 
    label: "Poor", 
    color: "from-orange-400 to-amber-400",
    description: "Significant improvements needed"
  };
  return { 
    label: "Insufficient", 
    color: "from-red-400 to-rose-400",
    description: "Does not meet minimum requirements"
  };
}

export function SubmissionCard({ submission }: { submission: SubmissionWithRelations }) {
  const statusConfig = getStatusConfig(submission.status);
  const { session } = useAuth();

  const gradeConfig = submission.aiScore !== null ? getGradeConfig(submission.aiScore) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-gray-700 hover:shadow-purple-500 hover:shadow-inner transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <User className="w-4 h-4" />
              <span className="text-sm">
                {submission.submitter.address.slice(0, 6)}...
                {submission.submitter.address.slice(-4)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {formatDistance(submission.createdAt)}
              </span>
            </div>
          </div>
          <Badge
            className={`bg-gradient-to-r ${statusConfig.gradient} ${statusConfig.hoverGradient} transition-all duration-300 border-none`}
          >
            <statusConfig.icon className="w-3 h-3 mr-1" />
            {submission.status}
          </Badge>
        </CardHeader>

        <CardContent className="mt-4 space-y-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="whitespace-pre-wrap text-gray-300"
          >
            {submission.submitterId === session?.user.id ? submission.content : `Submitted by ${submission.submitterId}`}
          </motion.p>

          <div className="flex items-center justify-between">
            {submission.aiScore !== null && gradeConfig && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="flex items-center gap-3 bg-gradient-to-br from-gray-800/40 to-gray-800/20 rounded-lg p-6 w-full backdrop-blur-sm border border-gray-700/30 shadow-lg"
              >
                <div className="relative">
                  <motion.div 
                    className="p-3 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Bot className="w-5 h-5 text-purple-300" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                  </motion.div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-300">AI Score</p>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-gray-400"
                      >
                        Evaluation
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="px-3 py-1 rounded-full bg-gradient-to-r border border-gray-700/50"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${gradeConfig.color.split(' ')[1]}, ${gradeConfig.color.split(' ')[3]})`
                      }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {gradeConfig.label}
                      </span>
                    </motion.div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="relative w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${submission.aiScore}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full relative"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${gradeConfig.color.split(' ')[1]}, ${gradeConfig.color.split(' ')[3]})`
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                          animate={{
                            x: ["0%", "100%"],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </motion.div>
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xs text-gray-400"
                      >
                        {gradeConfig.description}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, type: "spring" }}
                        className="min-w-16 text-right"
                      >
                        <span className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                          {submission.aiScore}/100
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}