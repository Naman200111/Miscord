import { db } from "@/db/drizzle";
import { channels, messages, servers, serverUsers } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, lt, or } from "drizzle-orm";
import z from "zod";

export const messageProcedure = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        channelId: z.string().nonempty(),
        serverId: z.string().nonempty(),
        limit: z.number().min(1).max(100),
        cursor: z
          .object({
            updatedAt: z.date(),
            id: z.uuid(),
          })
          .nullish(),
      })
    )
    .query(
      async ({
        input: { channelId, serverId, cursor, limit },
        ctx: { id: userId },
      }) => {
        const [server] = await db
          .select()
          .from(servers)
          .where(eq(servers.id, serverId));
        if (!server) {
          throw new TRPCError({
            message: "No server found",
            code: "NOT_FOUND",
          });
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

        const [channel] = await db
          .select()
          .from(channels)
          .where(
            and(eq(channels.serverId, serverId), eq(channels.id, channelId))
          );

        if (!channel) {
          throw new TRPCError({
            message: "No Channel found !!",
            code: "BAD_REQUEST",
          });
        }

        let messageList = await db
          .select()
          .from(messages)
          .where(
            and(
              eq(messages.channelId, channelId),
              cursor
                ? or(
                    lt(messages.updatedAt, cursor.updatedAt),
                    and(
                      eq(messages.updatedAt, cursor.updatedAt),
                      lt(messages.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          .orderBy(desc(messages.updatedAt), desc(messages.id))
          .limit(limit + 1);
        let nextCursor = null;

        if (messageList.length === limit + 1) {
          messageList = messageList.slice(0, -1);
          nextCursor = {
            updatedAt: messageList[messageList.length - 1].updatedAt,
            id: messageList[messageList.length - 1].id,
          };
        }

        return {
          nextCursor,
          messageList,
        };
      }
    ),
});
