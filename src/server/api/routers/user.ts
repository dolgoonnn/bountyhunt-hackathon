import { MESSAGE_TO_SIGN, verifySignature } from "@/server/auth/verify-message";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session } from "@/server/auth/types";

export const userRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [user, activeBounties, completedSubmissions] = await Promise.all([
      ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      }),
      ctx.db.bounty.count({
        where: {
          creatorId: ctx.session.user.id,
          status: "ACTIVE",
        },
      }),
      ctx.db.submission.count({
        where: {
          submitterId: ctx.session.user.id,
          status: "ACCEPTED",
        },
      }),
    ]);

    return {
      reputation: user?.reputation ?? 0,
      activeBounties,
      completedSubmissions,
    };
  }),

  getProfile: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { address: input.address },
        include: {
          _count: {
            select: {
              bounties: true,
              submissions: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    }),
    getMessageToSign: publicProcedure.query(() => {
      console.log("Getting message to sign:", MESSAGE_TO_SIGN); // Debug log
      return MESSAGE_TO_SIGN;
    }),

  verifyLogin: publicProcedure
    .input(
      z.object({
        address: z.string(),
        signature: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isValid = verifySignature(input.address, input.signature);

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid signature",
        });
      }

      let user = await ctx.db.user.findUnique({
        where: { address: input.address },
      });

      if (!user) {
        user = await ctx.db.user.create({
          data: {
            id: input.address,
            address: input.address,
          },
        });
      }
         // Create the session
         const session: Session = {
          user: {
            id: user.id,
            address: user.address,
          },
        };

        // Update the context with the new session
        ctx.session = session;
        console.log("🚀 ~ .mutation ~   ctx.session:",   ctx.session)

      return {
        user: {
          id: user.id,
          address: user.address,
        },
      };
    }),
});
