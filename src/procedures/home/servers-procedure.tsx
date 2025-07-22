import { db } from "@/db/drizzle";
import { servers, serverUsers, users } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";

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
