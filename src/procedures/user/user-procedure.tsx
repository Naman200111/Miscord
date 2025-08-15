import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";

export const userProcedure = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(async ({ ctx: { id: userId } }) => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  }),
});
