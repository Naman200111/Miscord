import { db } from "@/db/drizzle";
import { channels, servers } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

export const channelProcedure = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().nonempty(),
        type: z.enum(["TEXT", "AUDIO", "VIDEO"]),
        serverId: z.uuid().nonempty(),
      })
    )
    .mutation(
      async ({ input: { name, type, serverId }, ctx: { id: userId } }) => {
        const [server] = await db
          .select()
          .from(servers)
          .where(eq(servers.id, serverId));
        if (!server) {
          throw new TRPCError({
            message: "No server found !",
            code: "BAD_REQUEST",
          });
        }

        const [createChannel] = await db
          .insert(channels)
          .values({
            name,
            type,
            userId,
            serverId,
          })
          .returning();

        return createChannel;
      }
    ),
});
