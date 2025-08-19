import { db } from "@/db/drizzle";
import { serverUsers, users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, getTableColumns } from "drizzle-orm";

export const userProcedure = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(async ({ ctx: { id: userId } }) => {
    const [user] = await db
      .select({
        user: {
          ...getTableColumns(users),
        },
        serverUser: {
          ...getTableColumns(serverUsers),
        },
      })
      .from(users)
      .innerJoin(serverUsers, eq(serverUsers.userId, userId))
      .where(eq(users.id, userId));
    return user;
  }),
});
