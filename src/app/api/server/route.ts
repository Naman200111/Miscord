import { db } from "@/db/drizzle";
import { servers, serverUsers } from "@/db/schema";
import { getCurrentUser } from "@/lib/get-user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, imageUrl, imageKey } = await req.json();
    const user = await getCurrentUser();

    if (!name || !user) {
      return new NextResponse("Server Name required", { status: 400 });
    }

    const [createServer] = await db
      .insert(servers)
      .values({
        name,
        imageUrl,
        imageKey,
        // Todo: 'add invite link logic
        inviteLink: "",
      })
      .returning();

    const [createServerUser] = await db
      .insert(serverUsers)
      .values({
        userId: user.id,
        serverId: createServer.id,
        role: "ADMIN",
      })
      .returning();

    return NextResponse.json({
      createServer,
      createServerUser,
    });
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
