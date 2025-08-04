import { db } from "@/db/drizzle";
import { servers, serverUsers, users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { generateInviteCode } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";

export const serverProcedure = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        name: z.string().nonempty(),
        imageUrl: z.string(),
        imageKey: z.string(),
        serverId: z.uuid().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx;
      const { name, imageUrl, imageKey, serverId } = input;

      if (serverId) {
        const [updateServer] = await db
          .update(servers)
          .set({ name, imageKey, imageUrl })
          .where(eq(servers.id, serverId))
          .returning();

        if (!updateServer) {
          throw new TRPCError({
            message: "Failed to update server",
            code: "BAD_REQUEST",
          });
        }
        return updateServer;
      }

      const [createServer] = await db
        .insert(servers)
        .values({
          name,
          imageUrl,
          imageKey,
          inviteCode: generateInviteCode(),
        })
        .returning();

      if (!createServer) {
        throw new TRPCError({
          message: "Failed to create server",
          code: "NOT_FOUND",
        });
      }

      const [createServerUser] = await db
        .insert(serverUsers)
        .values({
          userId,
          serverId: createServer.id,
          role: "ADMIN",
        })
        .returning();

      if (!createServerUser) {
        throw new TRPCError({
          message: "Failed to create server user entry",
          code: "NOT_FOUND",
        });
      }

      return {
        createServerUser,
      };
    }),

  deleteOrLeave: protectedProcedure
    .input(
      z.object({
        serverId: z.uuid(),
      })
    )
    .mutation(async ({ input, ctx: { id: userId } }) => {
      const { serverId } = input;

      const [userServerData] = await db
        .delete(serverUsers)
        .where(
          and(
            eq(serverUsers.serverId, serverId),
            eq(serverUsers.userId, userId)
          )
        )
        .returning();

      if (userServerData.role === "ADMIN") {
        await db.delete(servers).where(eq(servers.id, serverId)).returning();
      }
    }),

  getOne: protectedProcedure
    .input(z.object({ serverId: z.string().nonempty() }))
    .query(async ({ input: { serverId }, ctx: { id: userId } }) => {
      const [serverDetails] = await db
        .select({
          ...getTableColumns(serverUsers),
          user: {
            ...getTableColumns(users),
          },
          server: {
            ...getTableColumns(servers),
          },
        })
        .from(serverUsers)
        .innerJoin(users, eq(users.id, serverUsers.userId))
        .innerJoin(servers, eq(servers.id, serverUsers.serverId))
        .where(
          and(
            eq(serverUsers.userId, userId),
            eq(serverUsers.serverId, serverId)
          )
        );
      return serverDetails;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const { id: userId } = ctx;

    const serversList = await db
      .select({
        ...getTableColumns(serverUsers),
        server: { ...getTableColumns(servers) },
      })
      .from(serverUsers)
      .innerJoin(servers, eq(servers.id, serverUsers.serverId))
      .where(eq(serverUsers.userId, userId))
      .orderBy(asc(serverUsers.createdAt));

    return serversList;
  }),

  deleteServerImage: protectedProcedure
    .input(z.object({ imageKey: z.string().nonempty() }))
    .mutation(async ({ input: { imageKey } }) => {
      const utapi = new UTApi();
      await utapi.deleteFiles([imageKey]);
    }),

  updateInviteCode: protectedProcedure
    .input(z.object({ serverId: z.uuid() }))
    .mutation(async ({ input: { serverId } }) => {
      const newInviteCode = generateInviteCode();
      const [updatedServer] = await db
        .update(servers)
        .set({ inviteCode: newInviteCode })
        .where(eq(servers.id, serverId))
        .returning();
      return updatedServer;
    }),
});
