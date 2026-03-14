import { db } from "@/db/drizzle";
import { messages } from "@/db/schema";
import { messageData } from "@/types/types";
import { eq } from "drizzle-orm";
import { Socket } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: HTTPServer & {
      io: Server;
    };
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
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
              .values({ id, channelId, serverId, userId, msg })
              .returning();
            console.log("message added to db");
          }

          io.emit(`chat:message`, {
            id: customizeMessage.id,
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
