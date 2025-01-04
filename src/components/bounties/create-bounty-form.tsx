"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useBountyContract } from "@/hooks/useBountyContract";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coins, FileText, ListChecks, Loader2, PenSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

const createBountySchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  requirements: z.string().transform((str) => str.split("\n").filter(Boolean)),
  reward: z.number().positive(),
  isEducational: z.boolean().default(false),
});

type FormData = z.infer<typeof createBountySchema>;

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const inputAnimation = {
  focus: { scale: 1.02, transition: { duration: 0.2 } }
};

export function CreateBountyForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentFormData, setCurrentFormData] = useState<FormData | null>(null);
  const [isPendingBlockchainTx, setIsPendingBlockchainTx] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createBountySchema),
    defaultValues: {
      isEducational: false,
    },
  });

  const {
    createBounty: createBountyContract,
    isLoading: isContractLoading,
    error: contractError,
    hash,
    isSuccess
  } = useBountyContract();

  const createBountyMutation = api.bounty.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Bounty created successfully",
        description: "Your bounty has been published",
      });
      router.push("/bounties");
    },
    onError: (error) => {
      toast({
        title: "Error creating bounty",
        description: error.message,
        variant: "destructive",
      });
      setCurrentFormData(null);
      setIsPendingBlockchainTx(false);
    },
  });

  useEffect(() => {
    if (isSuccess && currentFormData && isPendingBlockchainTx) {
      createBountyMutation.mutate({
        title: currentFormData.title,
        description: currentFormData.description,
        requirements: currentFormData.requirements,
        reward: currentFormData.reward,
        isEducational: currentFormData.isEducational,
      });
      setCurrentFormData(null);
    }
  }, [isSuccess, currentFormData, isPendingBlockchainTx]);

  useEffect(() => {
    if (contractError) {
      toast({
        title: "Contract Error",
        description: contractError.message,
        variant: "destructive",
      });
    }
  }, [contractError, toast]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isPendingBlockchainTx) return;
      setCurrentFormData(data);
      setIsPendingBlockchainTx(true);
      await createBountyContract(data.title, data.reward.toString());
    } catch (error) {
      console.error('Error creating bounty:', error);
      toast({
        title: "Error creating bounty",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setCurrentFormData(null);
      setIsPendingBlockchainTx(false);
    }
  };

  const isSubmitting = isContractLoading || createBountyMutation.isPending;

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-gray-700">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formAnimation}
        className="space-y-8"
      >
        <div className="border-b border-gray-700 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-200">Create New Bounty</h2>
          <p className="text-gray-400 mt-1">Fill out the form below to create a new bounty</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <motion.div whileFocus="focus" variants={inputAnimation}>
                  <FormItem className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <FormLabel className="flex items-center gap-2 text-gray-200">
                      <PenSquare className="h-4 w-4 text-purple-400" />
                      Title
                    </FormLabel>
                    <FormControl className="">
                      <Input 
                        {...field} 
                        className="bg-gray-900/50 text-white focus:outline-none border-gray-700 focus:border-purple-500 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </motion.div>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <motion.div whileFocus="focus" variants={inputAnimation}>
                  <FormItem className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <FormLabel className="flex items-center gap-2 text-gray-200">
                      <FileText className="h-4 w-4 text-purple-400" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="bg-gray-900/50 text-white focus:outline-none resize-none border-gray-700 focus:border-purple-500 transition-colors min-h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </motion.div>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <motion.div whileFocus="focus" variants={inputAnimation}>
                  <FormItem className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <FormLabel className="flex items-center gap-2 text-gray-200">
                      <ListChecks className="h-4 w-4 text-purple-400" />
                      Requirements (one per line)
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="bg-gray-900/50 text-white focus:outline-none resize-none border-gray-700 focus:border-purple-500 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </motion.div>
              )}
            />

            <FormField
              control={form.control}
              name="reward"
              render={({ field }) => (
                <motion.div whileFocus="focus" variants={inputAnimation}>
                  <FormItem className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <FormLabel className="flex items-center gap-2 text-gray-200">
                      <Coins className="h-4 w-4 text-purple-400" />
                      Reward (ETH)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className="bg-gray-900/50 border-gray-700 focus:border-purple-500 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </motion.div>
              )}
            />

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none h-12"
                disabled={isSubmitting || isContractLoading}
              >
                {isSubmitting || isContractLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Bounty"
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </Card>
  );
}