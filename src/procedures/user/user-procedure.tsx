import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const userProcedure = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx;
  }),
});
