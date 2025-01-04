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

const createBountySchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  requirements: z.string().transform((str) => str.split("\n").filter(Boolean)),
  reward: z.number().positive(),
  isEducational: z.boolean().default(false),
});

type FormData = z.infer<typeof createBountySchema>;

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
    error: contractError,hash, isSuccess
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

  // Watch for successful transaction confirmation
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


  const onSubmit = async (data: FormData) => {
    try {
      if (isPendingBlockchainTx) return;
      setCurrentFormData(data); // Store the form data
      setIsPendingBlockchainTx(true);

      // Create the bounty on the blockchain
      await createBountyContract(
        data.title,
        data.reward.toString()
      );

      // The database mutation will be handled by the useEffect after transaction confirmation

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

  // Show error if contract interaction fails
  useEffect(() => {
    if (contractError) {
      toast({
        title: "Contract Error",
        description: contractError.message,
        variant: "destructive",
      });
    }
  }, [contractError, toast]);

  const isSubmitting = isContractLoading || createBountyMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements (one per line)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward (ETH)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isContractLoading}
        >
          {isSubmitting || isContractLoading ? "Creating..." : "Create Bounty"}
        </Button>
      </form>
    </Form>
  );
}
