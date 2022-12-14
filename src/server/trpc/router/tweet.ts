import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const tweetRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        text: z.string({
          required_error: "TEXT is required for your TWEET",
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { text } = input;

      const userId = session.user.id;

      return prisma.tweet.create({
        data: {
          text,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
});
