import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";


const createSubmissionSchema = z.object({
  bountyId: z.string(),
  content: z.string().min(1).max(10000),
});

const updateSubmissionStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "IMPROVED"]),
});
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function evaluateSubmission(content: string, requirements: string[]) {
  try {
    const prompt = `You are evaluating a submission for a bounty. Please score this submission from 0-100 based on how well it meets the requirements. Only respond with a number between 0 and 100.

Requirements:
${requirements.map((req) => `- ${req}`).join("\n")}

Submission:
${content}`;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 0,
    });

    const aiResponse = response?.choices[0]?.message?.content;
    console.log("🚀 ~ evaluateSubmission ~ aiResponse:", aiResponse)
    if (!aiResponse) {
      throw new Error("Invalid response from AI");
    }
    const score = parseInt(aiResponse);
    if (isNaN(score) || score < 0 || score > 100) {
      throw new Error("Invalid score received from AI");
    }

    return score;
  } catch (error) {
    console.error("Error evaluating submission:", error);
    return null;
  }
}


export const submissionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSubmissionSchema)
    .mutation(async ({ ctx, input }) => {
      const bounty = await ctx.db.bounty.findUnique({
        where: { id: input.bountyId },
        select: {
          isOpen: true,
          status: true,
          creatorId: true,
          requirements: true,
        },
      });

      if (!bounty) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bounty not found",
        });
      }

      if (!bounty.isOpen || bounty.status !== "ACTIVE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bounty is not accepting submissions",
        });
      }

      console.log("🚀 ~ .mutation ~ bounty.creatorId:", bounty.creatorId)
      if (bounty.creatorId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot submit to your own bounty",
        });
      }

      const existingSubmission = await ctx.db.submission.findFirst({
        where: {
          bountyId: input.bountyId,
          submitterId: ctx.session.user.id,
        },
      });

      if (existingSubmission) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already submitted to this bounty",
        });
      }

      // Get AI score for the submission
      const aiScore = await evaluateSubmission(
        input.content,
        bounty.requirements,
      );

      return ctx.db.submission.create({
        data: {
          bountyId: input.bountyId,
          submitterId: ctx.session.user.id,
          content: input.content,
          status: "PENDING",
          aiScore: aiScore,
        },
        include: {
          submitter: {
            select: {
              id: true,
              address: true,
              reputation: true,
            },
          },
          bounty: {
            select: {
              id: true,
              title: true,
              reward: true,
              status: true,
              isOpen: true,
            },
          },
        },
      });
    }),

  list: publicProcedure
    .input(
      z.object({
        bountyId: z.string(),
        status: z
          .enum(["PENDING", "ACCEPTED", "REJECTED", "IMPROVED"])
          .optional(),
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { bountyId, status, limit, cursor } = input;

      const bounty = await ctx.db.bounty.findUnique({
        where: { id: bountyId },
        select: { id: true },
      });

      if (!bounty) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bounty not found",
        });
      }

      const submissions = await ctx.db.submission.findMany({
        take: limit + 1,
        where: {
          bountyId,
          ...(status && { status }),
        },
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          submitter: {
            select: {
              id: true,
              address: true,
              reputation: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (submissions.length > limit) {
        const nextItem = submissions.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: submissions,
        nextCursor,
      };
    }),

  listUserSubmissions: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["PENDING", "ACCEPTED", "REJECTED", "IMPROVED"])
          .optional(),
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { status, limit, cursor } = input;

      const submissions = await ctx.db.submission.findMany({
        take: limit + 1,
        where: {
          submitterId: ctx.session.user.id,
          ...(status && { status }),
        },
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          submitter: {
            select: {
              id: true,
              address: true,
              reputation: true,
            },
          },
          bounty: {
            select: {
              id: true,
              title: true,
              reward: true,
              status: true,
              isOpen: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (submissions.length > limit) {
        const nextItem = submissions.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: submissions,
        nextCursor,
      };
    }),

  updateStatus: protectedProcedure
    .input(updateSubmissionStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const submission = await ctx.db.submission.findUnique({
        where: { id: input.id },
        include: {
          bounty: {
            select: {
              creatorId: true,
              isOpen: true,
              status: true,
            },
          },
        },
      });

      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found",
        });
      }

      if (submission.bounty.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the bounty creator can update submission status",
        });
      }

      if (!submission.bounty.isOpen || submission.bounty.status !== "ACTIVE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot update submission status for closed bounty",
        });
      }

      if (input.status === "ACCEPTED") {
        await ctx.db.submission.updateMany({
          where: {
            bountyId: submission.bountyId,
            id: { not: input.id },
            status: { not: "REJECTED" },
          },
          data: { status: "REJECTED" as const },
        });
      }

      return ctx.db.submission.update({
        where: { id: input.id },
        data: { status: input.status },
        include: {
          submitter: {
            select: {
              id: true,
              address: true,
              reputation: true,
            },
          },
          bounty: {
            select: {
              id: true,
              title: true,
              reward: true,
              status: true,
              isOpen: true,
            },
          },
        },
      });
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const submission = await ctx.db.submission.findUnique({
        where: { id: input },
        include: {
          submitter: {
            select: {
              id: true,
              address: true,
              reputation: true,
            },
          },
          bounty: {
            select: {
              id: true,
              title: true,
              reward: true,
              status: true,
              isOpen: true,
              creatorId: true,
            },
          },
        },
      });

      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found",
        });
      }

      if (
        submission.submitterId !== ctx.session.user.id &&
        submission.bounty.creatorId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view this submission",
        });
      }

      return submission;
    }),

  recalculateScore: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const submission = await ctx.db.submission.findUnique({
        where: { id: input },
        include: {
          bounty: {
            select: {
              creatorId: true,
              requirements: true,
            },
          },
        },
      });

      if (!submission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Submission not found",
        });
      }

      if (submission.bounty.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the bounty creator can recalculate scores",
        });
      }

      const aiScore = await evaluateSubmission(
        submission.content,
        submission.bounty.requirements,
      );

      return ctx.db.submission.update({
        where: { id: input },
        data: { aiScore },
        include: {
          submitter: {
            select: {
              id: true,
              address: true,
              reputation: true,
            },
          },
          bounty: {
            select: {
              id: true,
              title: true,
              reward: true,
              status: true,
              isOpen: true,
            },
          },
        },
      });
    }),
});
