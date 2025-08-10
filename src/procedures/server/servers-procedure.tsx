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

      if (!serverDetails) {
        throw new TRPCError({
          message: "You are no a part of this server",
          code: "BAD_REQUEST",
        });
      }
      return serverDetails;
    }),

  getOneFromInvite: protectedProcedure
    .input(z.object({ inviteCode: z.string().nonempty() }))
    .query(async ({ input: { inviteCode }, ctx: { id: userId } }) => {
      const [server] = await db
        .select()
        .from(servers)
        .where(eq(servers.inviteCode, inviteCode));

      if (!server) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This Invite Link is no longer valid",
        });
      }

      const [serverUserDetails] = await db
        .select()
        .from(serverUsers)
        .where(
          and(
            eq(serverUsers.serverId, server.id),
            eq(serverUsers.userId, userId)
          )
        );

      if (!serverUserDetails) {
        const [userAdded] = await db
          .insert(serverUsers)
          .values({
            serverId: server.id,
            userId,
            role: "MEMBER",
          })
          .returning();

        if (!userAdded) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong.",
          });
        }

        return userAdded;
      }

      return serverUserDetails;
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
    .input(
      z.object({
        imageKey: z.string().nonempty(),
        serverId: z.string().nonempty(),
      })
    )
    .mutation(
      async ({ input: { imageKey, serverId }, ctx: { id: userId } }) => {
        const [serverUser] = await db
          .select()
          .from(serverUsers)
          .where(
            and(
              eq(serverUsers.serverId, serverId),
              eq(serverUsers.userId, userId)
            )
          );

        if (serverUser.role !== "ADMIN") {
          return new TRPCError({
            message: "You You cannot perform this action.",
            code: "UNAUTHORIZED",
          });
        }

        const utapi = new UTApi();
        await utapi.deleteFiles([imageKey]);
      }
    ),

  updateInviteCode: protectedProcedure
    .input(z.object({ serverId: z.uuid() }))
    .mutation(async ({ input: { serverId }, ctx: { id: userId } }) => {
      const [serverUser] = await db
        .select()
        .from(serverUsers)
        .where(
          and(
            eq(serverUsers.serverId, serverId),
            eq(serverUsers.userId, userId)
          )
        );

      if (serverUser.role !== "ADMIN") {
        return new TRPCError({
          message: "You You cannot perform this action.",
          code: "UNAUTHORIZED",
        });
      }

      const newInviteCode = generateInviteCode();
      const [updatedServer] = await db
        .update(servers)
        .set({ inviteCode: newInviteCode })
        .where(eq(servers.id, serverId))
        .returning();
      return updatedServer;
    }),

  getManyMembers: protectedProcedure
    .input(z.object({ serverId: z.string() }))
    .query(async ({ input: { serverId } }) => {
      const members = await db
        .select({
          ...getTableColumns(serverUsers),
          user: {
            ...getTableColumns(users),
          },
        })
        .from(serverUsers)
        .innerJoin(users, eq(users.id, serverUsers.userId))
        .where(eq(serverUsers.serverId, serverId));

      return members;
    }),

  roleUpdate: protectedProcedure
    .input(
      z.object({
        receiverUserId: z.uuid(),
        to: z.enum(["MEMBER", "MODERATOR"]),
        from: z.enum(["MEMBER", "MODERATOR", "ADMIN"]),
        serverId: z.uuid(),
      })
    )
    .mutation(
      async ({
        input: { receiverUserId, to, from, serverId },
        ctx: { id: userId },
      }) => {
        const [serverUserDetails] = await db
          .select()
          .from(serverUsers)
          .where(
            and(
              eq(serverUsers.serverId, serverId),
              eq(serverUsers.userId, userId)
            )
          );

        const [receiverServerUserDetails] = await db
          .select()
          .from(serverUsers)
          .where(
            and(
              eq(serverUsers.serverId, serverId),
              eq(serverUsers.userId, receiverUserId)
            )
          );

        if (!receiverServerUserDetails) {
          throw new TRPCError({
            message: "Receiver not a part of Server",
            code: "BAD_REQUEST",
          });
        }

        const loggedInUserRole = serverUserDetails.role;
        if (loggedInUserRole === "MEMBER") {
          throw new TRPCError({
            message: "You cannot perform this action.",
            code: "UNAUTHORIZED",
          });
        }

        if (from === "MODERATOR" && loggedInUserRole === "MODERATOR") {
          throw new TRPCError({
            message: "You cannot perform this action.",
            code: "UNAUTHORIZED",
          });
        }

        const roleUpdate = await db
          .update(serverUsers)
          .set({
            role: to,
          })
          .where(
            and(
              eq(serverUsers.serverId, serverId),
              eq(serverUsers.userId, receiverUserId)
            )
          )
          .returning();
        return roleUpdate;
      }
    ),

  serverKick: protectedProcedure
    .input(
      z.object({
        kickedUserId: z.uuid(),
        kickedUserRole: z.enum(["MEMBER", "MODERATOR", "ADMIN"]),
        serverId: z.uuid(),
      })
    )
    .mutation(
      async ({
        input: { kickedUserId, kickedUserRole, serverId },
        ctx: { id: userId },
      }) => {
        const [serverUserDetails] = await db
          .select()
          .from(serverUsers)
          .where(
            and(
              eq(serverUsers.serverId, serverId),
              eq(serverUsers.userId, userId)
            )
          );

        const [kickedServerUserDetails] = await db
          .select()
          .from(serverUsers)
          .where(
            and(
              eq(serverUsers.serverId, serverId),
              eq(serverUsers.userId, kickedUserId)
            )
          );

        if (!kickedServerUserDetails) {
          throw new TRPCError({
            message: "No user found in the Server",
            code: "BAD_REQUEST",
          });
        }

        if (kickedServerUserDetails.role === "ADMIN") {
          throw new TRPCError({
            message: "Server Admin cannot be kicked from the server.",
            code: "BAD_REQUEST",
          });
        }

        const loggedInUserRole = serverUserDetails.role;
        if (loggedInUserRole === "MEMBER") {
          throw new TRPCError({
            message: "You cannot perform this action.",
            code: "UNAUTHORIZED",
          });
        }

        if (kickedUserRole !== "MEMBER" && loggedInUserRole === "MODERATOR") {
          throw new TRPCError({
            message: "You cannot perform this action.",
            code: "UNAUTHORIZED",
          });
        }

        const userKicked = await db
          .delete(serverUsers)
          .where(
            and(
              eq(serverUsers.serverId, serverId),
              eq(serverUsers.userId, kickedUserId)
            )
          )
          .returning();
        return userKicked;
      }
    ),
});
