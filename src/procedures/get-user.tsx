import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getCurrentUser = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  const [currentUserFromDB] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.id));

  let userId = currentUserFromDB?.id;

  if (!currentUserFromDB) {
    const [userData] = await db
      .insert(users)
      .values({
        clerkId: clerkUser.id,
        name: `${clerkUser.fullName}`,
        email: clerkUser.emailAddresses[0].emailAddress,
        imageUrl: clerkUser.imageUrl,
      })
      .returning();
    userId = userData.id;
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  return user;
};
