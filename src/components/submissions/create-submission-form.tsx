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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => createSubmission.mutate(data))}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submission Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your solution..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {createSubmission ? "Submitting..." : "Create Submission"}
        </Button>
      </form>
    </Form>
  );
}
