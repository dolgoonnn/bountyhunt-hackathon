import { useState } from "react";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistance } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { SubmissionStatus } from "@prisma/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBountyContract } from "@/hooks/useBountyContract";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Bot, CheckCircle, ChevronRight, Clock, 
  FileText, RefreshCw, Shield, ThumbsDown, Trophy, User, XCircle 
} from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

function getStatusConfig(status: SubmissionStatus) {
  const configs = {
    ACCEPTED: {
      gradient: "from-green-500 to-emerald-500",
      hoverGradient: "hover:from-green-600 hover:to-emerald-600",
      icon: CheckCircle,
      iconColor: "text-green-400",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    REJECTED: {
      gradient: "from-red-500 to-rose-500",
      hoverGradient: "hover:from-red-600 hover:to-rose-600",
      icon: XCircle,
      iconColor: "text-red-400",
      bgGradient: "from-red-500/10 to-rose-500/10"
    },
    IMPROVED: {
      gradient: "from-blue-500 to-cyan-500",
      hoverGradient: "hover:from-blue-600 hover:to-cyan-600",
      icon: RefreshCw,
      iconColor: "text-blue-400",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    PENDING: {
      gradient: "from-yellow-500 to-amber-500",
      hoverGradient: "hover:from-yellow-600 hover:to-amber-600",
      icon: Clock,
      iconColor: "text-yellow-400",
      bgGradient: "from-yellow-500/10 to-amber-500/10"
    }
  };
  return configs[status];
}

export function SubmissionDetails({ id }: { id: string }) {
  const { toast } = useToast();
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isCompletingBounty, setIsCompletingBounty] = useState(false);
  const {session} = useAuth()
  const {
    data: submission,
    isLoading,
    refetch,
  } = api.submission.getById.useQuery(id);

  const {
    completeBounty,
    isLoading: isContractLoading,
    error: contractError,
    isSuccess: isContractSuccess,
  } = useBountyContract();

  const updateStatus = api.submission.updateStatus.useMutation({
    onSuccess: async () => {
      toast({
        title: "Status updated",
        description: "The submission status has been updated successfully",
      });
      await refetch();
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const recalculateScore = api.submission.recalculateScore.useMutation({
    onSuccess: async (updatedSubmission) => {
      setIsRecalculating(false);
      toast({
        title: "Score recalculated",
        description: `New AI score: ${updatedSubmission.aiScore ?? "N/A"}`,
      });
      await refetch();
    },
    onError: (error) => {
      setIsRecalculating(false);
      toast({
        title: "Error recalculating score",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner  />
      </div>
    );
  }

  if (!submission) {
    return (
      <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
        <AlertDescription>Submission not found</AlertDescription>
      </Alert>
    );
  }

  const handleStatusUpdate = async (status: SubmissionStatus) => {
    if (status === "ACCEPTED") {
      try {
        setIsCompletingBounty(true);
        await completeBounty(submission.bountyId, submission.submitter.address);
        if (isContractSuccess) {
          await updateStatus.mutateAsync({ id: submission.id, status });
          toast({
            title: "Bounty completed",
            description: "The bounty has been completed and the reward has been transferred",
          });
        }
      } catch (error) {
        toast({
          title: "Error completing bounty",
          description: contractError?.message ?? "Failed to complete bounty",
          variant: "destructive",
        });
      } finally {
        setIsCompletingBounty(false);
      }
    } else {
      updateStatus.mutate({ id: submission.id, status });
    }
  };

  const handleRecalculateScore = async () => {
    setIsRecalculating(true);
    await recalculateScore.mutateAsync(submission.id);
  };

  const statusConfig = getStatusConfig(submission.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-gray-700">
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-700/50">
          <div className="flex flex-col gap-6">
            <Link
              href={`/bounties/${submission.bountyId}`}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Bounty
            </Link>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-200 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-400" />
                  Submission for &quot;{submission.bounty.title}&quot;
                </h1>
                <div className="mt-2 flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {submission.submitter.address.slice(0, 6)}...
                    {submission.submitter.address.slice(-4)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDistance(submission.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <Badge 
                  className={`bg-gradient-to-r ${statusConfig.gradient} ${statusConfig.hoverGradient} border-none transition-all duration-300`}
                >
                  <statusConfig.icon className="w-3 h-3 mr-1" />
                  {submission.status}
                </Badge>

                {submission.aiScore !== null && (
                  <div className="flex items-center gap-2 bg-gray-800/30 px-3 py-1.5 rounded-full">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-200">
                      Score: {submission.aiScore}/100
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Solution Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/30 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-200">Solution</h2>
            </div>
            <p className="whitespace-pre-wrap text-gray-300">
              {submission.content}
            </p>
          </motion.div>

          {/* Submitter Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/30 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-200">Submitted by</h2>
            </div>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Address: {submission.submitter.address}
              </p>
              <p className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gray-400" />
                Reputation: {submission.submitter.reputation}
              </p>
            </div>
          </motion.div>

          {/* Actions Section */}
          {submission.bounty.isOpen && submission.bounty.status === "ACTIVE" && submission.status === "PENDING" && session?.user.id !== submission.submitter.id && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-t border-gray-700/50 pt-6 space-y-4"
            >
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate("REJECTED")}
                  className="bg-red-500/10 hover:bg-red-500/20 text-white border-red-500/20 hover:border-red-500/30"
                  disabled={updateStatus.isPending}
                >
                  {updateStatus.isPending ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <ThumbsDown className="w-4 h-4 mr-2 text-white" />
                      Reject
                    </>
                  )}
                </Button>

                <Button 
                  onClick={() => handleStatusUpdate("ACCEPTED")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none"
                  disabled={isCompletingBounty}
                >
                  {isCompletingBounty ? (
                    <>
                      <LoadingSpinner  />
                      Completing Bounty...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => handleStatusUpdate("IMPROVED")}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300"
                  disabled={updateStatus.isPending}
                >
                  {updateStatus.isPending ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Request Improvements
                    </>
                  )}
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleRecalculateScore}
                  disabled={isRecalculating}
                  className="bg-purple-500/10 text-white hover:bg-purple-500/20 border-purple-500/20 hover:border-purple-500/30"
                >
                  {isRecalculating ? (
                    <>
                      <LoadingSpinner />
                      Recalculating Score...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Recalculate AI Score
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}