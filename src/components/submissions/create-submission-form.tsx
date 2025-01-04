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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FileText, Loader2, Send } from "lucide-react";

const createSubmissionSchema = z.object({
  content: z.string().min(1).max(10000),
  bountyId: z.string(),
});

type FormData = z.infer<typeof createSubmissionSchema>;

export function CreateSubmissionForm() {
  const router = useRouter();
  const params = useParams();
  const bountyId = params.id as string;
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(createSubmissionSchema),
    defaultValues: {
      bountyId,
      content: "",
    },
  });

  const createSubmission = api.submission.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Submission created successfully",
        description: "Your submission has been published",
      });
      router.push(`/bounties/${data.bountyId}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-gray-700">
        <div className="border-b border-gray-700/50 pb-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-200">Create Submission</h2>
              <p className="text-gray-400 mt-1">Submit your solution for the bounty</p>
            </div>
          </motion.div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => createSubmission.mutate(data))}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-gray-200">
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Send className="w-4 h-4 text-purple-400" />
                        Solution Details
                      </motion.div>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Textarea
                          placeholder="Enter your solution..."
                          className="min-h-[300px] bg-gray-900/50 border-gray-700/50 focus:border-purple-500/50 transition-all duration-300 text-gray-200 placeholder:text-gray-500 resize-none"
                          {...field}
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 pointer-events-none transition-all duration-300" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4 border-t border-gray-700/50"
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none h-12 group relative overflow-hidden"
                disabled={createSubmission.isPending}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/50 group-hover:to-pink-600/50 transition-all duration-300"
                  initial={false}
                  animate={{ 
                    x: createSubmission.isPending ? "100%" : "0%"
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                {createSubmission.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Create Submission
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}