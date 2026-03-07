import { db } from "@/db/drizzle";
import { channels, messages, servers, serverUsers, users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, getTableColumns, gt, lt, or } from "drizzle-orm";
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
            createdAt: z.date(),
            id: z.uuid(),
          })
          .nullish(),
      }),
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
              eq(serverUsers.userId, userId),
            ),
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
            and(eq(channels.serverId, serverId), eq(channels.id, channelId)),
          );

        if (!channel) {
          throw new TRPCError({
            message: "No Channel found !!",
            code: "BAD_REQUEST",
          });
        }

        let messageList = await db
          .select({
            ...getTableColumns(messages),
            imageUrl: users.imageUrl,
            name: users.name,
            role: serverUsers.role,
          })
          .from(messages)
          .innerJoin(users, eq(users.id, messages.userId))
          .innerJoin(
            serverUsers,
            and(
              eq(serverUsers.userId, users.id),
              eq(serverUsers.serverId, serverId),
            ),
          )
          .where(
            and(
              eq(messages.channelId, channelId),
              cursor
                ? or(
                    lt(messages.createdAt, cursor.createdAt),
                    and(
                      eq(messages.createdAt, cursor.createdAt),
                      gt(messages.id, cursor.id),
                    ),
                  )
                : undefined,
            ),
          )
          .orderBy(desc(messages.createdAt), asc(messages.id))
          .limit(limit + 1);
        let nextCursor = null;

        if (messageList.length === limit + 1) {
          nextCursor = {
            createdAt: messageList[messageList.length - 1].createdAt,
            id: messageList[messageList.length - 1].id,
          };
          // todo: check why this works and not doing this before setting nextcursor
          messageList = messageList.slice(0, -1);
        }
        
        messageList = messageList.reverse();
        return {
          nextCursor,
          messageList,
        };
      },
    ),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
      }),
    )
    .query(async ({ input: { id: messageId } }) => {
      const [message] = await db
        .select()
        .from(messages)
        .where(eq(messages.id, messageId));
      return message;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id: messageId } = input;
      const [message] = await db
        .select()
        .from(messages)
        .where(eq(messages.id, messageId));

      console.log(message, "message");
      if (!message) {
        throw new TRPCError({
          message: "This message does not exist.",
          code: "NOT_FOUND",
        });
      }

      const [updatedMessage] = await db
        .update(messages)
        .set({
          msg: "This message was deleted",
          isDeleted: true,
        })
        .where(eq(messages.id, message.id))
        .returning();

      return updatedMessage;
    }),
});
