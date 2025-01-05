import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, User, Bot, XCircle, Clock, RefreshCw } from "lucide-react";

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

export function SubmissionPreview({ submission }: { submission: SubmissionWithRelations }) {
  const statusConfig = getStatusConfig(submission.status);

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
            {submission.content}
          </motion.p>
          
          {submission.aiScore !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-4"
            >
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">AI Score</p>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${submission.aiScore}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className={`h-full rounded-full bg-gradient-to-r ${statusConfig.gradient}`}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-300">
                    {submission.aiScore}/100
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}