import { db } from "@/db/drizzle";
import { messages } from "@/db/schema";
import { messageData } from "@/types/types";
import { eq } from "drizzle-orm";
import { NextApiRequest } from "next";
import { Server } from "socket.io";

// Todo: give proper types
export default function handler(req: NextApiRequest, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket/io",
    });

    io.on("connection", (socket) => {
      console.log("Connection Built Successfully");

      socket.on(`chat:message`, async (msgData: messageData) => {
        const { channelId, serverId, userId, msg, id } = msgData;
        console.log(msgData, "msgData");

        try {
          console.log("adding message to db");
          socket.emit(`chat:message`, msgData);

          let customizeMessage;

          const [existingMessage] = await db
            .select()
            .from(messages)
            .where(eq(messages.id, id));

          if (existingMessage) {
            [customizeMessage] = await db
              .update(messages)
              .set({ msg, updatedAt: new Date() })
              .where(eq(messages.id, id))
              .returning();
            console.log("message updated in db");
          } else {
            [customizeMessage] = await db
              .insert(messages)
              .values({ channelId, serverId, userId, msg })
              .returning();
            console.log("message added to db");
          }

          io.emit(`chat:message`, {
            id,
            userId: customizeMessage.userId,
            channelId: customizeMessage.channelId,
            serverId: customizeMessage.serverId,
            updatedAt: customizeMessage.updatedAt,
            createdAt: customizeMessage.createdAt,
            msg: customizeMessage.msg,
            role: msgData.role,
            imageUrl: msgData.imageUrl,
            name: msgData.name,
            state: "success",
          });

          console.log("message emitted to everyone");
        } catch {
          console.log("error here");
          socket.emit(`error:sending`, { ...msgData, state: "error" });
        }

        // todo: add rate limiting
      });

      socket.on("disconnect", () => {
        console.log("Connection disconnected");
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
