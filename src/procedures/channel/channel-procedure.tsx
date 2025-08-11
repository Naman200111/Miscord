import { db } from "@/db/drizzle";
import { channels, servers, serverUsers } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
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

        if (name === "general") {
          throw new TRPCError({
            message: "Channel name is reserved",
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

  getMany: protectedProcedure
    .input(
      z.object({
        serverId: z.uuid().nonempty(),
      })
    )
    .query(async ({ input: { serverId }, ctx: { id: userId } }) => {
      const [server] = await db
        .select()
        .from(servers)
        .where(eq(servers.id, serverId));
      if (!server) {
        throw new TRPCError({ message: "No server found", code: "NOT_FOUND" });
      }

      const [serverUserDetails] = await db
        .select()
        .from(serverUsers)
        .where(
          and(
            eq(serverUsers.serverId, serverId),
            eq(serverUsers.userId, userId)
          )
        );

      if (!serverUserDetails) {
        throw new TRPCError({
          message: "User not in the server !!",
          code: "UNAUTHORIZED",
        });
      }

      const serverChannels = await db
        .select()
        .from(channels)
        .where(and(eq(channels.serverId, serverId)));

      return serverChannels;
    }),
});
