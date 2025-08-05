import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  return { clerkUserId: userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (opts) => {
  const {
    ctx: { clerkUserId },
  } = opts;
  const clerkUser = await currentUser();
  if (!clerkUserId || !clerkUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  let [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUserId));

  if (!user) {
    [user] = await db
      .insert(users)
      .values({
        clerkId: clerkUser.id,
        name: `${clerkUser.fullName}`,
        email: clerkUser.emailAddresses[0].emailAddress,
        imageUrl: clerkUser.imageUrl,
      })
      .returning();
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      ...user,
    },
  });
});
