import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
// import { createBountySchema, listBountiesSchema, updateBountySchema } from "./schemas";

// Schema definitions
const createBountySchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  requirements: z.array(z.string()),
  reward: z.number().positive(),
  isEducational: z.boolean().optional(),
});

const updateBountySchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  requirements: z.array(z.string()).optional(),
  reward: z.number().positive().optional(),
  isEducational: z.boolean().optional(),
});

const listBountiesSchema = z.object({
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  isOpen: z.boolean().optional(),
  isEducational: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional(),
  cursor: z.string().optional(),
});

export const bountyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createBountySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bounty.create({
        data: {
          ...input,
          creatorId: ctx.session.user.id,
          isOpen: true,
          status: "ACTIVE",
        },
      });
    }),

  update: protectedProcedure
    .input(updateBountySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const bounty = await ctx.db.bounty.findUnique({
        where: { id },
        select: { creatorId: true },
      });

      if (!bounty) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (bounty.creatorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.bounty.update({
        where: { id },
        data,
      });
    }),

  list: protectedProcedure
    .input(listBountiesSchema)
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 20;
      // Remove limit from filters by destructuring it explicitly
      const { cursor, limit: _, ...filters } = input;

      const bounties = await ctx.db.bounty.findMany({
        take: limit + 1,
        where: filters, // Now filters won't include the limit parameter
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          creator: true,
          _count: {
            select: { submissions: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (bounties.length > limit) {
        const nextItem = bounties.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: bounties,
        nextCursor,
      };
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const bounty = await ctx.db.bounty.findUnique({
        where: { id: input },
        include: {
          creator: true,
          submissions: {
            include: {
              submitter: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!bounty) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return bounty;
    }),

  listUserBounties: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.bounty.findMany({
      where: { creatorId: ctx.session.user.id },
      include: {
        creator: true,
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  complete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const bounty = await ctx.db.bounty.findUnique({
        where: { id: input },
        select: { creatorId: true },
      });

      if (!bounty) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (bounty.creatorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.bounty.update({
        where: { id: input },
        data: {
          status: "COMPLETED",
          isOpen: false,
        },
      });
    }),

  cancel: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const bounty = await ctx.db.bounty.findUnique({
        where: { id: input },
        select: { creatorId: true },
      });

      if (!bounty) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (bounty.creatorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.bounty.update({
        where: { id: input },
        data: {
          status: "CANCELLED",
          isOpen: false,
        },
      });
    }),
});
