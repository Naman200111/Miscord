import { db } from "@/db/drizzle";
import { servers, serverUsers, users } from "@/db/schema";
import { and, eq, getTableColumns } from "drizzle-orm";

export const getServersList = async (userId: string | null | undefined) => {
  if (!userId) return [];

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    return [];
  }

  const serversList = await db
    .select({
      ...getTableColumns(serverUsers),
      server: { ...getTableColumns(servers) },
    })
    .from(serverUsers)
    .innerJoin(servers, eq(servers.id, serverUsers.serverId))
    .where(eq(serverUsers.userId, user.id));

  return serversList;
};

export const getServerData = async ({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) => {
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
      and(eq(serverUsers.userId, userId), eq(serverUsers.serverId, serverId))
    );
  return serverDetails;
};
